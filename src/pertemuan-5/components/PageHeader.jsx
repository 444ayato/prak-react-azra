export default function PageHeader() {
    return (
        <div className="flex items-center justify-between p-4">
            {/* Left Section: Title & Breadcrumbs */}
            <div className="flex flex-col">
                <span className="text-3xl font-semibold text-gray-900">
                    Dashboard
                </span>
                <div className="flex items-center font-medium space-x-2 mt-2 text-gray-500">
                    <span>Dashboard</span>
                    <span>/</span>
                    <span>Order List</span>
                </div>
            </div>

            {/* Right Section: Action Button */}
            <div>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">
                    Add Button
                </button>
            </div>
        </div>
    );
}