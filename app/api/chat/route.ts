import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return Response.json({ error: "No API Key" }, { status: 500 });

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey,
    });

    // --- TAHAP 1: PEMBERSIHAN SUPER KETAT ---
    // Groq benci metadata. Kita bikin array baru yang benar-benar bersih.
    const cleanMessages = messages
      // 1. Hanya ambil pesan dari 'user' atau 'assistant'. Buang system/tool/data.
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      // 2. Format ulang isinya jadi string polos
      .map((m: any) => {
        let contentStr = '';

        if (typeof m.content === 'string') {
          contentStr = m.content;
        } else if (Array.isArray(m.content)) {
          // Kalau formatnya Array (multimodal), ambil teksnya saja
          contentStr = m.content
            .filter((c: any) => c.type === 'text')
            .map((c: any) => c.text)
            .join(' ');
        }

        return {
          role: m.role,
          content: contentStr || ' ', // Jangan biarkan kosong total
        };
      });

    // --- TAHAP 2: OTAK AI ---
    const systemPrompt = `
    Kamu adalah KOPI AI, sahabat ngopi dari KOPILOKA.
    Karakter: Santai, ramah, suka emoji ☕.
    Tugas: Jawab pertanyaan user. Jika melenceng, belokkan halus ke topik kopi.
    Produk: Arabika Toraja (185rb), Robusta Lampung (85rb), Gayo Aceh (225rb).
    Jawab ringkas saja.
    `;

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: cleanMessages, // Pakai pesan yang sudah dicuci bersih
      system: systemPrompt,
      // temperature: 0.7, <-- KITA HAPUS INI karena bikin warning di Groq
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[Groq Error Detail]:", error);
    return Response.json(
      { error: "Gagal memproses", details: error.message },
      { status: 500 }
    );
  }
}
