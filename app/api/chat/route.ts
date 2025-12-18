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

    // --- SOLUSI NUKLIR: TEXT-ONLY ENFORCER ---
    // Kita buat array baru dari nol.
    // Kita paksa semua format aneh menjadi string biasa.
    
    const textOnlyMessages = messages.map((m: any) => {
      let contentString = "";

      // SKENARIO 1: Content adalah String biasa
      if (typeof m.content === 'string') {
        contentString = m.content;
      } 
      // SKENARIO 2: Content adalah Array (Multimodal/Vercel format)
      else if (Array.isArray(m.content)) {
        // Kita cari bagian yang tipe-nya 'text' saja.
        // Bagian 'image' atau 'file' kita BUANG TOTAL.
        contentString = m.content
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.text)
          .join(' ');
      }

      // Pastikan role hanya 'user' atau 'assistant'.
      // 'system' kita buang dari history (karena sudah ada di system prompt).
      // 'data' atau 'tool' kita ubah jadi 'user' biar gak error.
      let validRole = 'user';
      if (m.role === 'assistant') validRole = 'assistant';

      return {
        role: validRole,
        content: contentString || '.', // Jangan biarkan kosong, kasih titik kalau kosong
      };
    });
    // ------------------------------------------

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: textOnlyMessages, // Gunakan pesan yang sudah disaring murni
      system: `
        Kamu KOPI AI, asisten KOPILOKA.
        Jawab pertanyaan seputar kopi dengan ramah dan santai.
        Gunakan emoji ☕.
        Produk: Arabika Toraja (185rb), Robusta Lampung (85rb), Gayo Aceh (225rb).
      `,
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[Groq Error]:", error);
    return Response.json(
      { error: "Gagal memproses", details: error.message },
      { status: 500 }
    );
  }
}
