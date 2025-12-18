import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "No API Key" }, { status: 500 });
    }

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey,
    });

    // 1. PEMBERSIHAN PESAN (Wajib buat Groq)
    // Supaya dia ingat obrolan sebelumnya (Context Aware)
    const cleanMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // 2. OTAK CERDAS (SYSTEM PROMPT DINAMIS)
    // Di sini kuncinya supaya dia tidak kaku.
    const systemPrompt = `
    Kamu adalah KOPI AI, teman ngopi virtual yang cerdas dan asik dari KOPILOKA.
    
    Kepribadianmu:
    - Cerdas & Berwawasan: Kamu bisa menjawab pertanyaan apa saja (sejarah, tips, curhat), tidak cuma soal jualan.
    - Santai & Humoris: Gunakan bahasa gaul yang sopan (lo/gue atau aku/kamu tergantung user), pakai emoji ☕✨.
    - Empati: Kalau user curhat sedih, hibur mereka (tawarkan kopi hangat). Kalau senang, rayakan bersama.

    Knowledge Base Produk KOPILOKA (Tawarkan ini secara natural hanya jika relevan):
    - Arabika Toraja (185rb): Rasa buah, asam segar. Cocok buat yang suka rasa kompleks.
    - Robusta Lampung (85rb): Pahit mantap, strong. Cocok buat begadang/kopi susu.
    - Gayo Aceh (225rb): Kualitas terbaik, aroma rempah.

    Aturan Jawab:
    - Jangan kaku seperti robot. Jawablah layaknya barista sahabat user.
    - Jika user tanya di luar topik kopi (misal: "Coding susah ya?"), jawablah dengan cerdas, lalu coba hubungkan tipis-tipis ke filosofi kopi (misal: "Coding emang butuh fokus, Bro. Sambil ngopi Robusta Lampung biar melek codingnya lancar!").
    - Jawaban harus ringkas (maksimal 3 paragraf pendek).
    `;

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'), // Model paling pintar di Groq
      messages: cleanMessages,
      system: systemPrompt,
      temperature: 0.7, // 0.7 artinya Kreatif tapi tetap nyambung (tidak ngelantur)
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[AI Error]:", error);
    return Response.json(
      { error: "Gagal memproses", details: error.message },
      { status: 500 }
    );
  }
}
