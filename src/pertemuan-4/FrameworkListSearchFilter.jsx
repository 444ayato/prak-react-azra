import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkListSearchFilter() {
  /** Deklrasai state **/
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedTag, setSelectedTag] = useState("");

  /*Inisialisasi DataForm*/
		const [dataForm, setDataForm] = useState({
			searchTerm: "",
			selectedTag: "",
			/*Tambah state lain beserta default value*/
			});
		
		/*Inisialisasi Handle perubahan nilai input form*/
		const handleChange = (evt) => {
			const { name, value } = evt.target;
			setDataForm({
				...dataForm,
				[name]: value,
			});
		};

  /** Deklrasai Logic Search & Filter **/
  const _searchTerm = dataForm.searchTerm.toLowerCase();
  const filteredFrameworks = frameworkData.filter((framework) => {
    const matchesSearch =
      framework.name.toLowerCase().includes(_searchTerm) ||
      framework.description.toLowerCase().includes(_searchTerm);

    const matchesTag = dataForm.selectedTag
      ? framework.tags.includes(dataForm.selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  /** Deklarasi pengambilan unique tags di frameworkData **/
  const allTags = [
    ...new Set(frameworkData.flatMap((framework) => framework.tags)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
          Tech{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Explorer
          </span>
        </h1>

        {/* Container Input & Select */}
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <input
              type="text"
              name="searchTerm"
              placeholder="Search framework..."
              value={dataForm.searchTerm}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/80 backdrop-blur-sm"
            />
            <svg
              className="w-5 h-5 text-slate-400 absolute left-3 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            name="selectedTag"
            value={dataForm.selectedTag}
            onChange={handleChange}
            className="w-full md:w-48 p-3 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white/80 backdrop-blur-sm font-medium text-slate-600"
          >
            <option value="">All Tags</option>
            {allTags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFrameworks.length > 0 ? (
          filteredFrameworks.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                    <svg
                      className="w-6 h-6 text-blue-600 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                    {item.details?.releaseYear}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h2>

                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {item.details && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Developer
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {item.details.developer}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-8 pb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <a
                  href={item.details?.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-blue-600 transition-all duration-300"
                >
                  Visit Website
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-slate-400 text-lg font-medium">
              No frameworks found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
