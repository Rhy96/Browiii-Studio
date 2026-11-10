
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method tidak diizinkan." });

  const { image, prompt, aspectRatio, duration } = req.body || {};

  if (!image || !prompt) {
    return res.status(400).json({ error: "Gambar dan prompt wajib diisi." });
  }

  if (!process.env.VIDEO_API_URL || !process.env.VIDEO_API_KEY) {
    return res.status(503).json({
      error: "Mesin video belum dikonfigurasi. Tambahkan VIDEO_API_URL dan VIDEO_API_KEY dari penyedia API video resmi yang mendukung image-to-video."
    });
  }

  try {
    const upstream = await fetch(process.env.VIDEO_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VIDEO_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image, prompt, aspectRatio, duration })
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return res.status(502).json({
        error: data.error || "Penyedia API video menolak permintaan."
      });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(502).json({
      error: "Tidak dapat menghubungi penyedia API video."
    });
  }
}

