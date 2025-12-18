export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Ambil API Key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "API Key Kosong di Vercel" }, { status: 500 });
    }

    // 2. Minta daftar model yang tersedia langsung ke Google
    // Kita pakai fetch manual supaya tidak tergantung error SDK
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: 'GET' }
    );

    const data = await response.json();

    // 3. Tampilkan hasilnya ke frontend
    return Response.json({
      role: "assistant",
      content: `STATUS DIAGNOSA:\n\n` + 
               `Status Code: ${response.status}\n` +
               `Response: ${JSON.stringify(data, null, 2)}`
    });

  } catch (error: any) {
    return Response.json({
      role: "assistant",
      content: `Error Fatal: ${error.message}`
    });
  }
}
