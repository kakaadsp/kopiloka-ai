import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY tidak ditemukan." },
        { status: 500 }
      );
    }

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey,
    });

    const systemPrompt = `Kamu adalah KOPI AI, asisten virtual dari KOPILOKA.
    
    Tugasmu:
    1. Rekomendasi Kopi (Arabika/Robusta).
    2. Edukasi cara seduh.
    3. Arahkan belanja di KOPILOKA.
    
    Produk:
    - Arabika Toraja (185rb), Robusta Lampung (85rb), Gayo Aceh (225rb).
    
    Gaya: Ramah, santai, pakai emoji ☕.`;

    // UPDATE PENTING DI SINI:
    // Ganti 'llama3-8b-8192' (mati) menjadi 'llama-3.3-70b-versatile' (hidup & canggih)
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'), 
      messages: messages,
      system: systemPrompt,
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[AI Error]:", error);
    return Response.json(
      { 
        error: "Gagal memproses permintaan AI", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
