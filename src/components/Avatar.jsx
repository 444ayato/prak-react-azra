export default function Avatar({ name = "" }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-800 shadow-sm border border-gray-400/10">
      {/* Mengambil huruf pertama dari parameter name */}
      {name.charAt(0)}
    </div>
  );
}