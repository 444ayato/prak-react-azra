import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Avatar from '../components/Avatar';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Card from '../components/Card';
import ProductCard from '../components/ProductCard';
import Table from '../components/Table';
import InputField from '../components/InputField';
import TextArea from '../components/TextArea';
import SelectField from '../components/SelectField';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';

export default function Components() {
  const [showModal, setShowModal] = useState(false);

  const tableHeaders = ["No", "Nama Produk", "Kategori", "Harga", "Aksi"];
  
  const dummyProducts = [
    { id: 1, name: "Laptop Asus", category: "Elektronik", price: "Rp 8.000.000" },
    { id: 2, name: "Sepatu Sport", category: "Fashion", price: "Rp 450.000" },
    { id: 3, name: "Jam Tangan", category: "Aksesoris", price: "Rp 799.000" }
  ];

  const kategoriOptions = ["Makanan", "Minuman", "Elektronik", "Fashion", "Aksesoris"];

  const keunggulanAplikasi = [
    { icon: "⚡", title: "Performa Cepat", description: "Dibangun menggunakan React dan Vite untuk kecepatan render maksimal tanpa lemot." },
    { icon: "🛡️", title: "Keamanan Ketat", description: "Sistem enkripsi modern menjaga keamanan data transaksi dan akun Anda." },
    { icon: "🎨", title: "Desain Modern", description: "Tampilan antarmuka yang clean, responsif, serta memanjakan mata pengguna." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      {/* Header Halaman Utama */}
      <PageHeader title="Components" />
      
      {/* Container Utama Playground */}
      <div className="px-5 mt-4 space-y-8 flex-1">
        
        {/* 1. BASIC COMPONENTS (Buttons, Badges, Avatars) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Buttons</h3>
            <div className="flex gap-2">
              <Button type="primary">Edit</Button>
              <Button type="success">Simpan</Button>
              <Button type="danger">Hapus</Button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Badges</h3>
            <div className="flex gap-2">
              <Badge type="success">Completed</Badge>
              <Badge type="warning">Pending</Badge>
              <Badge type="danger">Cancelled</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Avatars</h3>
            <div className="flex gap-2">
              <Avatar name="Budi" />
              <Avatar name="Siti" />
            </div>
          </div>
        </div>


        {/* 2. LAYOUT COMPONENTS (Container) */}
        <Container className="bg-gray-100 rounded-2xl border border-gray-200">
          <h1 className="text-2xl font-bold mb-1 text-gray-900">Daftar Produk</h1>
          <p className="text-gray-600 text-sm">
            Berikut adalah daftar produk terbaru dari Layout Container.
          </p>
        </Container>


        {/* 3. DATA DISPLAY COMPONENTS (Card, ProductCard, Table) */}
        <div>
          <Card>
            <h2 className="text-xl font-bold text-gray-900">Judul Card</h2>
            <p className="text-gray-600 mt-1">Ini adalah isi konten bawaan dari children di dalam card.</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <ProductCard
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            title="Sepatu Sport"
            category="Fashion"
            price="Rp 450.000"
            description="Sepatu sport modern dengan desain nyaman dan ringan untuk aktivitas sehari-hari."
          />
          <ProductCard
            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
            title="Smartphone"
            category="Elektronik"
            price="Rp 4.500.000"
            description="Smartphone dengan performa cepat, kamera jernih, dan baterai tahan lama."
          />
        </div>

        <div className="max-w-4xl">
          <Table headers={tableHeaders}>
            {dummyProducts.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 font-semibold text-blue-600">{product.price}</td>
                <td className="px-4 py-3">
                  <Button type="primary">Detail</Button>
                </td>
              </tr>
            ))}
          </Table>
        </div>


        {/* 4. FORM COMPONENTS (InputField, SelectField, TextArea) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-2xl space-y-5">
          <h3 className="text-base font-bold text-gray-800 mb-2">Simulasi Formulir Tambah Produk</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
              label="Nama Produk" 
              id="nama_produk" 
              placeholder="Masukkan nama produk..." 
            />
            <InputField 
              label="Harga Produk" 
              id="harga_produk" 
              type="number" 
              placeholder="Contoh: 50000" 
            />
          </div>

          <SelectField 
            label="Kategori" 
            id="kategori_produk" 
            options={kategoriOptions} 
          />

          <TextArea 
            label="Deskripsi Lengkap" 
            id="deskripsi_produk" 
            placeholder="Tuliskan spesifikasi atau detail di sini..." 
          />

          <div className="flex justify-end pt-2">
            <Button type="success">Simpan Produk Baru</Button>
          </div>
        </div>


        {/* 5. FEEDBACK COMPONENTS (Alert, Loading) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="space-y-4">
            <Alert type="success">Aksi Sukses! Data produk berhasil disimpan ke server.</Alert>
            <Alert type="danger">Terjadi Kesalahan! Koneksi database terputus.</Alert>
            
            <div className="bg-white rounded-xl border p-2 shadow-sm">
              <Loading inline={true} />
            </div>
          </div>

          <div className="space-y-4 bg-white rounded-xl border p-6 shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Uji Coba Dialog Modal</h3>
            <p className="text-xs text-gray-500 mb-4 max-w-xs">
              Klik tombol di bawah untuk memicu perubahan state komponen sembulan dialog box.
            </p>
            
            <div onClick={() => setShowModal(true)}>
              <Button type="warning">Buka Jendela Modal</Button>
            </div>
          </div>
        </div>


        {/* 6. SECTION COMPONENTS (HeroSection, FeatureSection) */}
        <div className="space-y-6">
          <HeroSection 
            title="Selamat Datang di Sedap Admin Playground!"
            subtitle="Tempat terbaik untuk bereksperimen, membangun, dan menguji coba modularitas komponen React yang tangguh serta reusable."
          >
            <Button type="secondary">Pelajari Modul</Button>
            <div onClick={() => alert('Mulai Eksplorasi!')}>
              <Button type="success">Mulai Sekarang</Button>
            </div>
          </HeroSection>

          <div className="max-w-5xl">
            <FeatureSection 
              tag="Keunggulan Kami"
              title="Kenapa Memilih Arsitektur Komponen Bersih?"
              features={keunggulanAplikasi}
            />
          </div>
        </div>

      </div>

      {/* Komponen Jendela Modal Pop-up */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Konfirmasi Sistem"
      >
        Halo Azra! Ini adalah komponen **Modal** interaktif yang dibangun secara dinamis menggunakan *children* dan manajemen *state* React. Komponen ini sukses berjalan!
      </Modal>

      {/* Bagian Footer Penutup Halaman */}
      <div className="px-5 mt-10">
        <Footer />
      </div>
    </div>
  );
}