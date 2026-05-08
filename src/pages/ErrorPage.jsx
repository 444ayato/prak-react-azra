import { Link } from 'react-router-dom';

export default function ErrorPage({ code, description, image }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-5">
      <img 
        src={image} 
        alt={`Error ${code}`} 
        className="w-80 mb-6" 
        onError={(e) => e.target.src = "https://via.placeholder.com/400?text=Error+Image"}
      />
      <h1 className="text-5xl font-bold text-gray-800 mb-2">Error {code}</h1>
      <p className="text-gray-500 mb-8 max-w-md">{description}</p>
      <Link to="/" className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg hover:bg-green-600 transition">
        Back to Dashboard
      </Link>
    </div>
  );
}