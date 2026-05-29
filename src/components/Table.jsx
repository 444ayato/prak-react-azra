export default function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border-b border-gray-200 px-4 py-3 text-left font-bold text-gray-700 text-sm"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-gray-700 text-sm">
          {children}
        </tbody>
      </table>
    </div>
  );
}