export default function TailwindCSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <FlexboxGrid />

      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
            Belajar Tailwind CSS 4 🚀
          </h1>
          <p className="mt-4 text-lg text-purple-200">
            Tampilan modern, clean, dan super keren dengan Tailwind.
          </p>
          <button className="mt-8 bg-gradient-to-r from-cyan-400 to-pink-500 hover:scale-105 transition transform duration-300 text-white font-semibold px-8 py-3 rounded-2xl shadow-2xl">
            Click Me
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Spacing />
          <Typography />
        </div>

        <div className="mt-12 flex flex-wrap gap-6 justify-center">
          <BorderRadius />
        </div>

        <div className="mt-16">
          <ShadowEffects />
        </div>
      </div>
    </div>
  );
}

function Spacing() {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold text-cyan-300">Card Title</h2>
      <p className="mt-4 text-purple-200">
        Ini adalah contoh penggunaan padding dan margin di Tailwind dengan efek glassmorphism.
      </p>
    </div>
  );
}

function Typography() {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold text-pink-300">Tailwind Typography</h2>
      <p className="text-purple-200 text-lg mt-4">
        Belajar Tailwind sangat menyenangkan, cepat, dan powerful untuk membuat UI modern!
      </p>
    </div>
  );
}

function BorderRadius() {
  return (
    <>
      <button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 transition duration-300 px-6 py-3 rounded-full shadow-xl font-semibold">
        Rounded Full
      </button>

      <button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-500 transition duration-300 px-6 py-3 rounded-2xl shadow-xl font-semibold">
        Rounded 2XL
      </button>

      <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition duration-300 px-6 py-3 rounded-lg shadow-xl font-semibold">
        Rounded LG
      </button>
    </>
  );
}

function FlexboxGrid() {
  return (
    <nav className="flex justify-between items-center bg-black/30 backdrop-blur-lg px-8 py-4 border-b border-white/10">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
        MyWebsite
      </h1>
      <ul className="flex space-x-8 text-purple-200 font-medium">
        <li className="hover:text-white transition"><a href="#">Home</a></li>
        <li className="hover:text-white transition"><a href="#">About</a></li>
        <li className="hover:text-white transition"><a href="#">Contact</a></li>
      </ul>
    </nav>
  );
}

function ShadowEffects() {
  return (
    <div className="bg-gradient-to-r from-indigo-500/30 to-pink-500/30 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl hover:shadow-pink-500/40 hover:scale-105 transition duration-300 text-center">
      <h3 className="text-3xl font-bold text-white">Hover me! ✨</h3>
      <p className="text-purple-200 mt-4 text-lg">
        Lihat efek bayangan dan animasi saat hover. Terlihat lebih hidup dan modern.
      </p>
    </div>
  );
}
