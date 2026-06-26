import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"
import { Loader2, ArrowLeft, Package } from "lucide-react"

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-green-500" />
    </div>
  )

  if (error) return (
    <div className="p-6">
      <Link to="/products" className="text-green-600 hover:underline mb-4 inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <div className="text-red-600 p-4 bg-red-50 rounded-xl">Gagal memuat produk: {error}</div>
    </div>
  )

  if (!product) return null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/products" className="text-green-600 hover:underline mb-6 inline-flex items-center gap-1 text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Products
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-white/70 text-sm">Product Details</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {product.description && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deskripsi</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Harga</p>
              <p className="text-xl font-bold text-gray-800 mt-1">Rp {Number(product.price).toLocaleString("id-ID")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Stok</p>
              <p className={`text-xl font-bold mt-1 ${product.stock > 10 ? "text-green-600" : "text-red-600"}`}>
                {product.stock}
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Product ID: {product.id}
          </div>
        </div>
      </div>
    </div>
  )
}