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

    // --- TEKNIK DEEP CLEANING (PEMBERSIHAN TOTAL) ---
    // Ini solusi untuk error di pertanyaan kedua.
    // Kita pastikan formatnya disukai Groq (Role + Content String)
    const cleanMessages = messages.map((m: any) => {
      let textContent = m.content;

      // Kadang Vercel SDK menyimpan content sebagai Array (bukan string).
      // Kita harus ubah paksa jadi String biasa.
      if (Array.isArray(m.content)) {
        textContent = m.content
          .map((c: any) => c.text || '') // Ambil properti .text saja
          .join('');
      }

      // Paksa return hanya 2 field ini. Buang field lain seperti 'id', 'createdAt'.
      return {
        role: m.role, // user atau assistant
        content: typeof textContent === 'string' ? textContent : String(textContent),
      };
    });
    // -------------------------------------------------

    const systemPrompt = `
    Kamu adalah KOPI AI, asisten virtual KOPILOKA.
    Gaya bicara: Santai, ramah, gunakan emoji ☕.
    Tugas: Jawab pertanyaan seputar kopi, rekomendasi produk, dan ngobrol santai.
    Produk: Arabika Toraja (185rb), Robusta Lampung (85rb).
    `;

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: cleanMessages, // Gunakan pesan yang sudah "dicuci"
      system: systemPrompt,
      temperature: 0.7,
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
