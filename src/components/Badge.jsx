export default function Badge({ children, type = "primary" }) {
  // Pemetaan class warna background dan teks berdasarkan properti type
  const types = {
    primary: "bg-blue-100 text-blue-600 font-bold",
    secondary: "bg-gray-100 text-gray-600 font-bold",
    success: "bg-green-100 text-green-600 font-bold",
    danger: "bg-red-100 text-red-600 font-bold",
    warning: "bg-yellow-100 text-yellow-600 font-bold",
  };

  return (
    <span className={`${types[type]} px-3 py-1 rounded-full text-xs transition-all tracking-wide inline-block shadow-sm`}>
      {children}
    </span>
  );
}