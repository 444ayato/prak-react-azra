import Button from "./Button";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Jika isOpen false, komponen tidak dirender sama sekali

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Box Konten Modal */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden animate-scaleUp">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 font-bold text-xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Batal
          </button>
          <Button type="primary" onClick={onClose}>Mengerti</Button>
        </div>

      </div>
    </div>
  );
}