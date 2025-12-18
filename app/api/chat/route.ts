export const maxDuration = 30

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 


if (!GEMINI_API_KEY) {
  // Ini akan memicu error di log Vercel jika kunci tidak ditemukan
  throw new Error("GEMINI_API_KEY is not set (Check NEXT_PUBLIC_API_KEY in Vercel)");
}

const systemPrompt = `Kamu adalah KOPI AI, asisten virtual cerdas dari KOPILOKA - marketplace kopi Indonesia terbesar.

Keahlianmu:
1. **Rekomendasi Kopi**: Memberikan rekomendasi kopi berdasarkan preferensi rasa (asam, pahit, manis), metode seduh, dan budget.
2. **Edukasi Kopi**: Menjelaskan jenis-jenis kopi Indonesia (Arabika, Robusta), asal daerah (Toraja, Gayo, Kintamani, dll), dan proses pengolahan.
3. **Tips Menyeduh**: Memberikan panduan menyeduh kopi dengan berbagai metode (V60, French Press, Espresso, Cold Brew, dll).
4. **Bantuan Transaksi**: Membantu pembeli menemukan produk dan menjawab pertanyaan tentang proses pembelian.
5. **Dukungan Penjual**: Membantu penjual/petani kopi dengan tips marketing, packaging, dan pengelolaan toko.

Gaya komunikasi:
- Ramah dan hangat seperti barista favorit
- Menggunakan bahasa Indonesia yang baik dengan sentuhan istilah kopi
- Responsif dan informatif
- Sesekali menggunakan analogi kopi yang menarik

Data produk tersedia di marketplace:
- Kopi Arabika Toraja Premium (Rp 185.000/250g) - Rating 4.9
- Kopi Robusta Lampung (Rp 85.000/500g) - Rating 4.7
- Kopi Gayo Aceh Specialty (Rp 225.000/250g) - Rating 4.8
- Kopi Kintamani Bali (Rp 165.000/250g) - Rating 4.6
- Kopi Flores Bajawa (Rp 195.000/250g) - Rating 4.8
- Kopi Java Preanger (Rp 145.000/250g) - Rating 4.5

Selalu rekomendasikan produk dari marketplace KOPILOKA jika relevan dengan pertanyaan user.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawMessages = body.messages || []

    console.log("[v0] Received messages:", JSON.stringify(rawMessages))

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Halo! Saya KOPI AI, asisten virtual dari KOPILOKA. Saya siap membantu Anda menemukan kopi terbaik, memberikan tips menyeduh, dan menjawab semua pertanyaan seputar kopi. Ada yang bisa saya bantu?",
          },
        ],
      },
      // Convert chat messages to Gemini format
      ...rawMessages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    console.log("[v0] Gemini API status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Gemini API error:", errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Gemini response data:", JSON.stringify(data).substring(0, 200))

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak bisa merespons saat ini."

    return Response.json({
      content: aiResponse,
      role: "assistant",
    })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return Response.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
