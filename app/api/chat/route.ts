import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Groq sangat cepat, tapi kita tetap set durasi aman
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Pastikan GROQ_API_KEY sudah ada di Settings Vercel
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY tidak ditemukan. Cek Vercel Environment Variables." },
        { status: 500 }
      );
    }

    // 2. Setup Koneksi ke Groq menggunakan adapter OpenAI
    // Kita arahkan baseURL ke server Groq
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey,
    });

    // 3. System Prompt (Otak si KOPI AI)
    const systemPrompt = `Kamu adalah KOPI AI, asisten virtual dari KOPILOKA - marketplace kopi Indonesia terbesar.
    
    Tugasmu:
    1. Rekomendasi Kopi: Bantu user memilih antara Arabika (asam/buah) atau Robusta (pahit/kuat).
    2. Edukasi: Jelaskan cara seduh (V60, Tubruk, French Press).
    3. Penjualan: Arahkan untuk membeli produk di KOPILOKA.
    
    Data Produk Unggulan:
    - Kopi Arabika Toraja Premium (Rp 185.000/250g)
    - Kopi Robusta Lampung (Rp 85.000/500g)
    - Kopi Gayo Aceh Specialty (Rp 225.000/250g)
    
    Gaya Bahasa: Ramah, santai, gunakan emoji kopi ☕, dan jawab dengan ringkas (maksimal 3 paragraf).`;

    // 4. Generate Jawaban pakai model Llama 3 (Gratis & Super Cepat)
    const result = await generateText({
      model: groq('llama3-8b-8192'), 
      messages: messages,
      system: systemPrompt,
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[Groq Error]:", error);
    return Response.json(
      { 
        error: "Gagal memproses permintaan AI", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
