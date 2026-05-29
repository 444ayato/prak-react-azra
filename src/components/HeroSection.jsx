export default function HeroSection({ title, subtitle, children }) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden my-4">
      {/* Dekorasi background estetik */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute left-1/3 top-5 w-24 h-24 bg-white/5 rounded-full blur-md"></div>

      <div className="max-w-2xl relative z-10">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-green-50 text-sm md:text-base mb-6 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-wrap gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}