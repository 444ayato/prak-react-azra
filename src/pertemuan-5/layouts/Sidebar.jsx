export default function Sidebar() {
  return (
    <div className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
      {/* Logo Section */}
      <div className="flex flex-col">
        <span className="font-poppins text-[48px] text-gray-900 leading-tight">
          Sedap <b className="text-green-500">.</b>
        </span>
        <span className="font-semibold text-gray-400">
          Modern Admin Dashboard
        </span>
      </div>

      {/* List Menu Section */}
      <div className="mt-10">
        <ul className="space-y-3">
          <li>
            <div className="flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:text-green-500 hover:font-extrabold transition-all">
              Dashboard
            </div>
          </li>
          <li>
            <div className="flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:text-green-500 hover:font-extrabold transition-all">
              Orders
            </div>
          </li>
          <li>
            <div className="flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:text-green-500 hover:font-extrabold transition-all">
              Customers
            </div>
          </li>
        </ul>
      </div>

      {/* Footer Section */}
      <div className="mt-auto">
        <div className="mb-10 flex items-center rounded-md bg-green-500 px-4 py-2 shadow-lg">
          <div className="text-sm text-white">
            <span>Please organize your menus through button below!</span>
            <div className="mt-3 flex items-center justify-center space-x-2 rounded-md bg-white p-2">
              <span className="flex items-center text-gray-600 font-medium cursor-pointer hover:text-green-600">
                Add Menus
              </span>
            </div>
          </div>
          {/* Perubahan Path Foto Hirono */}
          <img 
            className="ml-4 w-20 h-20 rounded-full border-2 border-white/20 object-cover" 
            src="/img/hirono.jpg" 
            alt="User Avatar Hirono" 
          />
        </div>
        
        <div className="flex flex-col">
          <span className="font-bold text-gray-400">
            Sedap Restaurant Admin Dashboard
          </span>
          <p className="font-light text-gray-400">
            &copy; 2025 All Right Reserved
          </p>
        </div>
      </div>
    </div>
  );
}