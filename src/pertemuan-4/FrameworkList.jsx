import frameworkData from "./framework.json";

export default function FrameworkList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-12">
      {/* Header dengan Gaya Modern */}
      <div className="max-w-6xl mx-auto mb-16 relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <h1 className="text-4xl md:text-5xl font-black text-center text-slate-800 tracking-tight">
          Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Frameworks</span>
        </h1>
        <p className="mt-4 text-center text-slate-500 font-medium max-w-2xl mx-auto">
          Eksplorasi ekosistem teknologi terbaik untuk membangun aplikasi masa depan yang skalabel dan performan.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {frameworkData.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 ease-in-out hover:-translate-y-2 overflow-hidden"
          >
            {/* Aksen Warna di Atas Kartu */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            <div className="p-8">
              {/* Header Kartu */}
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                  <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-widest">
                  {item.details?.releaseYear || 'N/A'}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h2>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                {item.description}
              </p>

              {/* Info Detail */}
              {item.details && (
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      BY
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Developer</p>
                      <p className="text-sm font-semibold text-slate-700">{item.details.developer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags & Action */}
            <div className="px-8 pb-8 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <a
                href={item.details?.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-200 transition-all duration-300"
              >
                Lihat Detail
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}