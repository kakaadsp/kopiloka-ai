import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // System prompt yang sama seperti sebelumnya
    const systemPrompt = `Kamu adalah KOPI AI, asisten virtual cerdas dari KOPILOKA - marketplace kopi Indonesia terbesar.
    
    Keahlianmu:
    1. Rekomendasi Kopi: Memberikan rekomendasi berdasarkan preferensi rasa.
    2. Edukasi Kopi: Menjelaskan jenis (Arabika/Robusta) dan asal daerah.
    3. Tips Menyeduh: Panduan V60, French Press, dll.
    4. Bantuan Transaksi: Membantu proses pembelian.
    
    Data produk tersedia:
    - Kopi Arabika Toraja Premium (Rp 185.000/250g)
    - Kopi Robusta Lampung (Rp 85.000/500g)
    - Kopi Gayo Aceh Specialty (Rp 225.000/250g)
    - Kopi Kintamani Bali (Rp 165.000/250g)
    - Kopi Flores Bajawa (Rp 195.000/250g)
    - Kopi Java Preanger (Rp 145.000/250g)
    
    Gaya bahasa: Ramah, hangat, Bahasa Indonesia yang baik.
    Selalu rekomendasikan produk KOPILOKA jika relevan.`;

    // Menggunakan 'generateText' dari Vercel AI SDK yang sudah terinstall
    // Kita gunakan model 'gemini-1.5-flash' yang efisien
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      messages: messages,
      system: systemPrompt,
    });

    // Frontend mengharapkan JSON object, bukan stream
    return Response.json({
      content: result.text,
      role: "assistant",
    });

  } catch (error) {
    console.error("[AI Error]:", error);
    return Response.json(
      { error: "Terjadi kesalahan pada AI", details: String(error) },
      { status: 500 }
    );
  }
}
