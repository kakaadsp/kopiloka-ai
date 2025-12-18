import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Ambil body request
    const body = await req.json();
    const messages = body.messages;

    // 2. CEK: Apakah messages ada? Apakah dia Array?
    // Kalau tidak, kita buat array kosong biar tidak error "undefined".
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Format pesan salah/kosong" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return Response.json({ error: "No API Key" }, { status: 500 });

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey,
    });

    // 3. SANITASI MANUAL (SAFE MODE)
    // Kita looping satu-satu dan pastikan tidak ada data 'undefined' yang lolos
    const safeMessages = messages
      .filter((m: any) => m !== null && typeof m === 'object') // Buang yang null
      .map((m: any) => {
        let contentStr = '';

        // Cek tipe content dengan hati-hati
        if (typeof m.content === 'string') {
          contentStr = m.content;
        } else if (Array.isArray(m.content)) {
          // Kalau array, gabungkan teksnya
          contentStr = m.content
            .filter((c: any) => c && c.type === 'text')
            .map((c: any) => c.text)
            .join(' ');
        }
        
        // Jaga-jaga kalau content kosong/undefined, kasih spasi biar gak crash
        if (!contentStr) {
            contentStr = ' ';
        }

        // Pastikan role-nya valid (user/assistant)
        // Kalau role aneh, default ke 'user'
        const role = (m.role === 'user' || m.role === 'assistant') ? m.role : 'user';

        return {
          role: role,
          content: contentStr,
        };
      });

    // 4. Generate
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: safeMessages, // Gunakan array yang sudah diamankan
      system: `
        Kamu adalah KOPI AI, asisten KOPILOKA.
        Tugas: Jawab pertanyaan user seputar kopi.
        Produk: Arabika Toraja (185rb), Robusta Lampung (85rb), Gayo Aceh (225rb).
        Gaya: Santai, ramah, pakai emoji ☕. Jawab ringkas.
      `,
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[Groq Error Detail]:", error);
    // Tampilkan error di console server tapi jangan bikin frontend crash total
    return Response.json(
      { error: "Terjadi kesalahan sistem", details: error.message },
      { status: 500 }
    );
  }
}
