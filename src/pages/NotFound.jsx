export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-9xl font-bold text-green-500">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mt-4">Wah, Halamannya Gak Ada!</p>
      <p className="text-gray-500 mt-2">Mungkin kamu salah ketik alamat atau halamannya sudah dipindah.</p>
      <a href="/" className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg">
        Kembali ke Dashboard
      </a>
    </div>
  );
}