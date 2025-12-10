import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);

  const loadDocs = async () => {
    const out = await axios.get("http://localhost:5000/documents");
    setDocs(out.data);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a PDF");

    const fd = new FormData();
    fd.append("file", file);

    await axios.post("http://localhost:5000/documents/upload", fd);
    setFile(null);
    loadDocs();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/documents/${id}`);
    loadDocs();
  };

  return (
    <div className="h-screen w-screen  bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex justify-center items-start p-4 sm:p-8 md:p-10">
      <div className="w-full max-w-lg md:max-w-xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-blue-700">
          Patient Document Portal
        </h2>

        <form
          onSubmit={handleUpload}
          className="bg-white p-4 sm:p-5 rounded-xl border shadow-sm flex flex-col gap-4"
        >
          <div>
            <label className="text-gray-700 font-medium text-sm sm:text-base">
              Select PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full mt-2 p-2 sm:p-3 rounded-lg border bg-gray-50
                         focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className=" hover:bg-blue-600 text-black
                       px-4 py-2 sm:py-3 rounded-lg font-semibold shadow-md
                       text-sm sm:text-base transition-all duration-200"
          >
            Upload
          </button>
        </form>

        <h3 className="text-lg sm:text-xl font-semibold mt-8 mb-4 text-gray-800">
          Uploaded Documents
        </h3>

        <div className="space-y-4">
          {docs.length === 0 && (
            <p className="text-gray-600 text-center text-sm sm:text-base">
              No documents uploaded yet.
            </p>
          )}

          {docs.map((d) => (
            <div
              key={d.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4
                         rounded-xl border shadow-sm hover:shadow-md
                         transition-all gap-3 sm:gap-0"
            >
              <span className="font-medium text-gray-700 break-all text-sm sm:text-base">
                {d.filename}
              </span>

              <div className="flex gap-3">
                <a
                  href={`http://localhost:5000/documents/${d.id}`}
                  download
                  className=" hover:bg-green-700 text-black
                             px-3 sm:px-4 py-2 rounded-lg shadow text-sm sm:text-base transition-all"
                >
                  Download
                </a>

                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-600 hover:bg-red-700 text-black
                             px-3 sm:px-4 py-2 rounded-lg shadow text-sm sm:text-base transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
