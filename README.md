# Browiii Motion

Website image-to-video responsif. Frontend dibuat dengan Vite; endpoint serverless ada di `api/generate.js` untuk deployment Vercel.

## Jalankan lokal
1. Install Node.js versi LTS.
2. Buka terminal di folder project.
3. Jalankan `npm install`
4. Jalankan `npm run dev`
5. Buka alamat lokal yang ditampilkan Vite.

Frontend dapat dicoba untuk upload dan preview gambar. Generate video membutuhkan adapter ke penyedia API image-to-video resmi.

## Deploy online ke Vercel
1. Buat akun di https://vercel.com lalu login.
2. Upload project ini ke repository GitHub, atau import project dari GitHub ke Vercel.
3. Di Vercel pilih **Add New → Project**, import repository `browiii-motion`.
4. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
5. Deploy. Vercel akan menyediakan alamat website.

## Mengaktifkan generate video
Endpoint `api/generate.js` adalah kerangka integrasi, bukan konektor Flow. Pilih penyedia API resmi yang secara eksplisit mendukung image-to-video, lalu sesuaikan format request, upload aset, dan polling hasilnya sesuai dokumentasi provider. Tambahkan `VIDEO_API_URL` dan `VIDEO_API_KEY` di Vercel → Project → Settings → Environment Variables, lalu redeploy.

**Penting:** Google AI Pro / Flow credits bukan otomatis API credits. Jangan memasukkan password Google atau Flow ke website ini, dan jangan menaruh API key di file frontend. Gunakan hanya API key resmi yang dibuat di portal penyedia API dan periksa billing/eligibility terlebih dahulu.

## Struktur
- `index.html` — tampilan utama
- `style.css` — desain responsif
- `src.js` — upload, prompt, dan komunikasi frontend
- `api/generate.js` — endpoint server untuk adapter API video
