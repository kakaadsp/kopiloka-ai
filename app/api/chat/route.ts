import { GoogleGenerativeAI } from "@google/generative-ai";

// Pastikan runtime edge jika didukung, atau nodejs standard
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

// Inisialisasi SDK
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Gunakan 'gemini-1.5-flash' yang merupakan model standar, cepat, dan gratis saat ini
// Jika masih error, baru coba 'gemini-pro'
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt = `Kamu adalah KOPI AI, asisten virtual cerdas dari KOPILOKA - marketplace kopi Indonesia terbesar.
Keahlianmu: Rekomendasi Kopi, Edukasi Kopi, Tips Menyeduh, Bantuan Transaksi.
Gaya komunikasi: Ramah, hangat, seperti barista, Bahasa Indonesia.
Data produk:
- Kopi Arabika Toraja Premium (Rp 185.000/250g)
- Kopi Robusta Lampung (Rp 85.000/500g)
- Kopi Gayo Aceh Specialty (Rp 225.000/250g)
- Kopi Kintamani Bali (Rp 165.000/250g)
- Kopi Flores Bajawa (Rp 195.000/250g)
- Kopi Java Preanger (Rp 145.000/250g)
Selalu rekomendasikan produk dari marketplace KOPILOKA jika relevan.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawMessages = body.messages || [];

    // Konversi history chat untuk format SDK
    // System prompt kita masukkan sebagai konteks awal
    const history = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Halo! Saya KOPI AI, siap membantu kebutuhan kopi Anda." }],
      },
      // Mapping pesan sebelumnya dari user
      ...rawMessages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    // Ambil pesan terakhir user yang baru saja dikirim
    const currentMessage = rawMessages[rawMessages.length - 1]?.content || "Halo";

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(currentMessage);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      content: text,
      role: "assistant",
    });

  } catch (error: any) {
    console.error("[v0] API Error:", error);
    
    // Fallback error handling
    return Response.json(
      { 
        error: "Failed to generate response", 
        details: error?.message || String(error) 
      },
      { status: 500 }
    );
  }
}
