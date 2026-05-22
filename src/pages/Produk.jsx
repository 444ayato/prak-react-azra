import { FaPlus, FaFilter, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom"; // Tambahkan import Link
import PageHeader from "../components/PageHeader";
import productsData from "../data/products.json";

export default function Produk() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <PageHeader title="Product List" breadcrumb="Products">
        <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600 transition shadow-lg">
          <FaPlus /> Add Product
        </button>
      </PageHeader>

      <div className="px-5">
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition">
                <FaFilter /> Filter
              </button>
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition">
                <FaDownload /> Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
                  <th className="pb-4 font-bold">ID</th>
                  <th className="pb-4 font-bold">Code</th>
                  <th className="pb-4 font-bold">Menu Name</th>
                  <th className="pb-4 font-bold">Category</th>
                  <th className="pb-4 font-bold">Vendor</th>
                  <th className="pb-4 font-bold">Price</th>
                  <th className="pb-4 font-bold">Stock</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y divide-gray-50">
                {productsData.map((product) => (
                  <tr key={product.id} className="hover:bg-green-50 transition">
                    <td className="py-4 font-bold text-green-600">{product.id}</td>
                    <td className="py-4 text-sm font-medium text-gray-500">{product.code}</td>
                    
                    {/* NAMA PRODUK DIUBAH MENJADI LINK */}
                    <td className="py-4 font-semibold">
                      <Link to={`/products/${product.id}`} className="text-emerald-400 hover:text-emerald-500 transition-colors">
                        {product.title}
                      </Link>
                    </td>

                    <td className="py-4 text-sm">{product.category}</td>
                    <td className="py-4 text-sm">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                        {product.brand}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </td>
                    
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        product.stock > 30 ? 'bg-green-100 text-green-600' : 
                        product.stock > 10 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {product.stock} Porsi
                      </span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}