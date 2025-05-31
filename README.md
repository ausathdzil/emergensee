# Emergensee

Emergensee adalah platform deteksi dini berbasis web untuk analisis tren gejala kesehatan masyarakat secara real-time, dengan fitur utama berupa AI-generated early warning dan automasi analisis berkala.

## Mobile App

[EmergenSee Mobile](https://github.com/Raya46/emergensee-mobile)

## Arsitektur Teknologi

### 1. Frontend

- **Next.js**
  - Framework utama untuk SSR/SSG, routing, dan rendering UI.
  - Menggunakan TailwindCSS untuk styling dan shadcn/ui untuk komponen aksesibilitas.
  - Visualisasi data menggunakan Recharts.

### 2. Backend & API

- **Next.js API Routes**
  - Seluruh endpoint backend (termasuk AI dan cron) diimplementasikan sebagai API route di dalam Next.js.
- **Drizzle ORM + Neon Postgres**
  - ORM modern untuk akses database yang typesafe dan efisien.
  - Database utama untuk menyimpan laporan gejala, hasil analisis AI, user, dsb.

### 3. AI Report (Early Warning)

- **@ai-sdk/google (Gemini 2.5) + ai**
  - Menggunakan LLM Google Gemini untuk menganalisis laporan gejala 24 jam terakhir.
  - Prompt AI didesain untuk menghasilkan array JSON berisi deteksi pola/gejala/lokasi signifikan, tingkat risiko, confidence, dan ringkasan analisis.
  - Hasil analisis AI disimpan ke database dan ditampilkan di dashboard/peringatan.
- **Zod**
  - Validasi dan parsing output AI agar selalu sesuai skema yang diharapkan.

### 4. Cron Job Otomatis

- **Vercel Cron**
  - Penjadwalan otomatis endpoint `/api/cron` setiap hari.
  - Endpoint ini akan memanggil pipeline AI report secara otomatis, sehingga analisis dan deteksi peringatan baru berjalan tanpa intervensi manual.

## Alasan Pemilihan Teknologi

### AI Report (Early Warning)

- **Google Gemini LLM via @ai-sdk/google**
  - Dipilih karena kemampuannya dalam pemrosesan bahasa alami dan reasoning yang kuat, sangat cocok untuk analisis tren gejala berbasis data tidak terstruktur.
  - Integrasi dengan SDK memudahkan orchestrasi prompt dan parsing output.
- **Zod**
  - Menjamin output AI selalu valid dan aman sebelum diproses lebih lanjut atau disimpan ke database.
- **Drizzle ORM**
  - Typesafe, mudah diintegrasikan dengan Next.js, dan mendukung query kompleks untuk kebutuhan analisis data kesehatan.

### Cron Job

- **Vercel Cron**
  - Native support di Vercel, sangat mudah dikonfigurasi tanpa perlu server terpisah atau third-party scheduler.
  - Menjamin pipeline AI report berjalan otomatis dan konsisten setiap hari, sehingga deteksi dini selalu up-to-date.
