import { createOpenAI } from '@ai-sdk/openai';
import { generateText, convertToCoreMessages } from 'ai'; // <--- TAMBAHAN PENTING

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

    // --- SOLUSI RESMI V5 ---
    // Jangan diparsing/map manual. Gunakan function bawaan library
    // untuk mengubah pesan Frontend menjadi format standar Backend.
    const coreMessages = convertToCoreMessages(messages);

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: coreMessages, // <--- Pakai yang sudah diconvert
      system: `
        Kamu adalah KOPI AI, asisten virtual KOPILOKA.
        Gaya: Santai, ramah, to-the-point, pakai emoji ☕.
        Tugas: Bantu user cari kopi & rekomendasi produk.
        Produk: Arabika Toraja (185rb), Robusta Lampung (85rb), Gayo Aceh (225rb).
        PENTING: Jawab hanya dengan teks, jangan pakai markdown tebal/miring berlebihan.
      `,
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
