import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Ambil data pesan dari Frontend
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key hilang" }, { status: 500 });
    }

    // 2. BERSIHKAN PESAN SECARA MANUAL (Strict Cleaning)
    // Kita bangun ulang array JSON-nya dari nol agar bersih total.
    const cleanMessages = messages.map((m: any) => {
      // Pastikan content selalu string
      let contentText = "";
      if (typeof m.content === 'string') {
        contentText = m.content;
      } else if (Array.isArray(m.content)) {
        // Gabungkan array text jika ada
        contentText = m.content.map((c: any) => c.text || "").join(" ");
      }
      
      // Default jika kosong
      if (!contentText.trim()) contentText = ".";

      return {
        role: m.role === 'user' ? 'user' : 'assistant', // Paksa role cuma 2 jenis
        content: contentText
      };
    });

    // Tambahkan System Prompt di awal array
    const finalMessages = [
      {
        role: "system",
        content: "Kamu adalah KOPI AI dari KOPILOKA. Jawab santai, ramah, pakai emoji ☕. Fokus jualan kopi (Arabika Toraja, Robusta Lampung)."
      },
      ...cleanMessages
    ];

    // 3. TEMBAK LANGSUNG KE GROQ (Tanpa Library Vercel AI)
    // Ini kuncinya: Kita pakai 'fetch' biasa. Library AI SDK tidak bisa ikut campur di sini.
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: finalMessages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    // Cek jika Groq masih error
    if (!response.ok) {
      console.error("Groq Raw Error:", data);
      throw new Error(data.error?.message || "Gagal menghubungi Groq");
    }

    // 4. Kembalikan jawaban ke Frontend
    const reply = data.choices[0].message.content;

    return NextResponse.json({
      role: 'assistant',
      content: reply
    });

  } catch (error: any) {
    console.error("[Manual Fetch Error]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan", details: error.message },
      { status: 500 }
    );
  }
}
