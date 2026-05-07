import { FaUserPlus, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

export default function Customers() {
  const customers = [
    { name: "Anisa Rahma", email: "anisa@example.com", phone: "0812-3456-7890", totalOrders: 12, img: "/img/hirono.jpg" },
    { name: "Budi Santoso", email: "budi.s@example.com", phone: "0857-1122-3344", totalOrders: 8, img: "/img/hirono.jpg" },
    { name: "Citra Lestari", email: "citra.les@example.com", phone: "0899-8877-6655", totalOrders: 25, img: "/img/hirono.jpg" },
    { name: "Dedi Kurniawan", email: "dedi.k@example.com", phone: "0811-2233-4455", totalOrders: 5, img: "/img/hirono.jpg" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <PageHeader />
      
      <div className="p-5 text-right mb-4">
        <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg ml-auto">
          <FaUserPlus /> Add New Customer
        </button>
      </div>

      <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customers.map((person, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border-b-4 border-transparent hover:border-green-500 transition-all">
            <img 
              src={person.img} 
              className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-green-50" 
              alt={person.name} 
            />
            <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
            <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-1 rounded mb-4">
              {person.totalOrders} Orders
            </span>
            
            <div className="w-full text-gray-500 text-sm space-y-2 mb-4">
              <p className="flex items-center justify-center gap-2">
                <FaEnvelope className="text-gray-400" /> {person.email}
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaPhoneAlt className="text-gray-400" /> {person.phone}
              </p>
            </div>
            
            <button className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-semibold hover:bg-green-500 hover:text-white transition-colors">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}