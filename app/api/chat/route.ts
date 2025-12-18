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

    // --- LOGIC BARU: HARD RESET ---
    // Kita BIKIN ARRAY BARU. Kita gak nge-map array lama.
    // Kita cuma ambil DUA hal: siapa yang ngomong (role) dan apa isinya (content).
    // Sisanya kita buang ke laut.
    
    const groqMessages = [];

    for (const m of messages) {
      // 1. Tentukan Role (Hanya terima user/assistant/system)
      let role = 'user';
      if (m.role === 'assistant') role = 'assistant';
      if (m.role === 'system') role = 'system';

      // 2. Ekstrak Content (Hanya String)
      let content = '';
      
      if (typeof m.content === 'string') {
        content = m.content;
      } else if (Array.isArray(m.content)) {
        // Kalau isinya array (gambar/file), ambil teksnya aja
        // Abaikan object yang gak punya properti 'text'
        content = m.content
          .map((c: any) => c?.text || '') 
          .join(' ');
      }

      // Kalau content kosong (misal cuma gambar doang tanpa caption), kasih spasi
      if (!content || content.trim().length === 0) {
        content = ' '; 
      }

      // 3. Masukkan ke array baru (Objek Baru Murni)
      groqMessages.push({
        role: role,
        content: content
      });
    }
    // ------------------------------------------

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: groqMessages, // PAKE ARRAY YANG BARU DIBIKIN
      system: `Kamu KOPI AI dari KOPILOKA. Jawab santai tentang kopi.`,
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("GROQ ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
