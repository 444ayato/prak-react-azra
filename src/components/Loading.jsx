export default function Loading({ inline = false }) {
  // Jika inline true (untuk playground), gunakan class ringkas. 
  // Jika false (default), gunakan class full-screen aslimu.
  const containerClass = inline 
    ? "flex flex-col justify-center items-center p-4 bg-transparent" 
    : "flex flex-col justify-center items-center min-h-screen bg-white";

  return (
    <div className={containerClass}>
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-green-600 text-lg font-medium">Loading...</p>
    </div>
  );
}