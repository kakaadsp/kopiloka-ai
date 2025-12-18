import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Set durasi timeout
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

    // --- FILTER MILITER (PENYELAMAT CHAT KEDUA DAN SETERUSNYA) ---
    // Kita tidak mempercayai struktur data dari frontend mentah-mentah.
    // Kita buat array BARU yang benar-benar bersih.
    
    const cleanMessages = messages.map((m: any) => {
      // 1. Ambil Content (Hanya Teks)
      let content = "";
      
      if (typeof m.content === 'string') {
        content = m.content;
      } else if (Array.isArray(m.content)) {
        // Kalau formatnya array (multimodal), ambil bagian text saja
        content = m.content
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.text)
          .join('');
      }

      // Pastikan content tidak kosong (Groq error kalau kosong)
      if (!content || content.trim() === "") {
        content = "."; // Isi titik sebagai placeholder
      }

      // 2. Ambil Role (Hanya user/assistant)
      // Groq kadang error kalau ada role 'system' atau 'data' di tengah history
      let role = 'user';
      if (m.role === 'assistant') role = 'assistant';
      // Jika role awalnya 'system', kita ubah jadi 'user' supaya masuk history tanpa error,
      // atau bisa di-skip, tapi amannya kita jadikan user context saja.

      // 3. RETUR (Hanya 2 field: role & content)
      // JANGAN sertakan field lain seperti id, createdAt, dll.
      return {
        role: role,
        content: content
      };
    });
    // ----------------------------------------------------------------

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: cleanMessages, // Gunakan pesan yang sudah difilter militer
      system: `
        Kamu adalah KOPI AI, asisten KOPILOKA.
        Karakter: Santai, lucu, suka emoji ☕.
        Tugas: Jawab pertanyaan user. Kalau user nanya aneh-aneh, jawab santai aja.
        Produk: Arabika Toraja, Robusta Lampung.
      `,
    });

    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[Groq Error]:", error);
    return Response.json(
      { error: "Error pada server", details: error.message },
      { status: 500 }
    );
  }
}
