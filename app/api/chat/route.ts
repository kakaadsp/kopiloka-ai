import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "API Key tidak ditemukan." },
        { status: 500 }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    // KITA GUNAKAN VERSI "LITE"
    // Versi Lite biasanya kuotanya lebih terbuka untuk akun gratisan
    const result = await generateText({
      model: google('gemini-2.0-flash-lite-001'), 
      messages: messages,
      system: `Kamu adalah KOPI AI, asisten virtual dari KOPILOKA.
      Tugas: Rekomendasi kopi, edukasi kopi, dan bantuan belanja.
      Gaya bahasa: Ramah, santai, singkat.
      
      Produk:
      - Arabika Toraja (185rb), Robusta Lampung (85rb), Gayo Aceh (225rb).`,
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[AI Error]:", error);
    return Response.json(
      { 
        error: "Gagal memproses permintaan", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
