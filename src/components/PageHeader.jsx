export default function PageHeader({ title, breadcrumb, children }) {
  return (
    <div className="flex items-center justify-between p-4 mb-6">
      <div className="flex flex-col">
        <span className="text-3xl font-semibold text-gray-900">{title}</span>
        <div className="flex items-center font-medium space-x-2 mt-2 text-gray-500">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-green-500 font-bold">
            {/* Mendukung string atau array sesuai instruksi */}
            {Array.isArray(breadcrumb) ? breadcrumb.join(" / ") : breadcrumb}
          </span>
        </div>
      </div>
      {/* Menampilkan tombol "Add" yang dikirim sebagai children */}
      <div>{children}</div>
    </div>
  );
}