import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-lochinvar-50 to-white">
      <nav className="w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold text-primary">EmergenSee</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="px-4 py-2 rounded-md font-medium text-primary bg-lochinvar-50"
          >
            Home
          </a>
          <a
            href="#fitur"
            className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
          >
            Fitur
          </a>
          <a
            href="#manfaat"
            className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
          >
            Manfaat
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="px-6">
            <Link href="/sign-up">Daftar</Link>
          </Button>
          <Button asChild className="px-6">
            <Link href="/sign-in">Masuk</Link>
          </Button>
        </div>
      </nav>

      <section className="w-full flex flex-col items-center text-center px-4 pt-8 pb-16 bg-gradient-to-b from-lochinvar-50 to-transparent">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold max-w-3xl mb-4 text-gray-900">
          Wujudkan Ketahanan Kesehatan Nasional
          <br />
          Dengan Dukungan Sistem{' '}
          <span className="text-primary">EmergenSee</span>
        </h1>
        <p className="text-gray-600 max-w-xl mb-6">
          Sistem pemantauan kesehatan real-time berbasis AI untuk deteksi dini,
          pengambilan keputusan, dan penguatan sistem JKN.
        </p>
        <Button size="lg" asChild className="mb-10">
          <Link href="/sign-in">Masuk untuk Mulai Pantau</Link>
        </Button>
        <div className="w-full flex justify-center">
          <Image src="/hero.png" alt="Hero" width={1000} height={800} />
        </div>
      </section>

      <section id="fitur" className="w-full max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-10 text-gray-900">
          Solusi Digital Untuk Ketahanan Sistem Kesehatan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="bg-lochinvar-50 rounded-full p-3 mb-2">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8z"
                    fill="#30887C"
                  />
                </svg>
              </div>
              <CardTitle className="text-center">
                Dashboard Kesehatan Harian
              </CardTitle>
              <CardDescription className="text-center">
                Data laporan gejala & status klaim BPJS dari seluruh wilayah
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="bg-lochinvar-50 rounded-full p-3 mb-2">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V19h-2v-2.07A8.001 8.001 0 014.07 13H2v-2h2.07A8.001 8.001 0 0111 4.07V2h2v2.07A8.001 8.001 0 0119.93 11H22v2h-2.07A8.001 8.001 0 0113 19.93z"
                    fill="#30887C"
                  />
                </svg>
              </div>
              <CardTitle className="text-center">
                Peta Konsentrasi Gejala
              </CardTitle>
              <CardDescription className="text-center">
                Heatmap lokasi gejala berdasarkan input dari aplikasi pasien
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="bg-lochinvar-50 rounded-full p-3 mb-2">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V19h-2v-2.07A8.001 8.001 0 014.07 13H2v-2h2.07A8.001 8.001 0 0111 4.07V2h2v2.07A8.001 8.001 0 0119.93 11H22v2h-2.07A8.001 8.001 0 0113 19.93z"
                    fill="#30887C"
                  />
                </svg>
              </div>
              <CardTitle className="text-center">
                Peringatan Dini Otomatis
              </CardTitle>
              <CardDescription className="text-center">
                Sistem alert berbasis tren untuk mendeteksi potensi wabah
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="manfaat" className="w-full bg-[#f3faf9] py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              Dampak Langsung Bagi Sistem Kesehatan Nasional
            </h3>
            <ul className="space-y-3 text-gray-700 text-base">
              <li>✅ Mendeteksi Gejala dan Klaster Lebih Cepat</li>
              <li>✅ Pendukung Kebijakan Berbasis Data Real-Time</li>
              <li>
                ✅ Transparansi & Akuntabilitas Distribusi Layanan Kesehatan
              </li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              src="/features.png"
              alt="Features"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>

      <footer className="w-full border-t py-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold text-primary">EmergenSee</span>
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-primary">
              Home
            </a>
            <a href="#fitur" className="hover:text-primary">
              Fitur
            </a>
            <a href="#manfaat" className="hover:text-primary">
              Manfaat
            </a>
          </div>
          <div className="text-gray-400 text-xs">
            © 2025 EmergenSee. Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </main>
  );
}
