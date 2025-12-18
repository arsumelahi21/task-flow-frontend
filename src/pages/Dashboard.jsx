import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Modal from "../components/Modal";
import { FiTrash2 } from "react-icons/fi";
import {
  countWords,
  validateProject,
} from "../utils/projectValidation";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };



  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

 

const createProject = async (e) => {
  e.preventDefault();

  const validationErrors = validateProject({
    title,
    description,
  });

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    setCreating(true);

    const res = await api.post("/projects", {
      title,
      description,
    });

    setProjects([...projects, res.data]);
    showToast("Project created successfully");

    setTitle("");
    setDescription("");
    setErrors({});
    setShowModal(false);
  } catch {
    showToast("Failed to create project", "error");
  } finally {
    setCreating(false);
  }
};



  const deleteProject = async () => {
  if (!deleteId) return;

  try {
    setDeleting(true);

    await api.delete(`/projects/${deleteId}`);
    setProjects((prev) => prev.filter((p) => p.id !== deleteId));

    showToast("Project deleted successfully");
  } catch (err) {
    showToast("Failed to delete project", "error");
  } finally {
    setDeleting(false);   
    setDeleteId(null);
  }
};



  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50" >
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Section header */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">My Projects</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full rounded-lg border bg-white
                  pl-10 pr-4 py-2 text-sm shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            </div>
           
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            >
              + New Project
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="bg-white border rounded p-6 text-center text-gray-500">
            No projects yet. Create your first project.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white border rounded p-6 text-center text-gray-500">
            No projects found matching “{search}”.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" > 
            {filteredProjects.map((project) => (
              <div
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="relative bg-white border rounded p-5 shadow-sm hover:shadow cursor-pointer transition"
               >
                <h3 className="font-semibold text-lg mb-1">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {project.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Tasks coming next →
                  </span>
                  <button
                        type="button"
                        onClick={(e) => {
                        e.stopPropagation();
                        setDeleting(false);
                        setDeleteId(project.id);
                        }}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold mb-4">New Project</h3>

        <form onSubmit={createProject} className="space-y-4">
           <div>
                <input
                    className={`w-full border rounded px-3 py-2 ${
                    errors.title ? "border-red-500" : ""
                    }`}
                    placeholder="Title *"
                    value={title}
                    onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: null });
                    }}
                />

                {errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                    {errors.title}
                    </p>
                )}
            </div>

            <div>
                <textarea
                    className={`w-full border rounded px-3 py-2 ${
                    errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="Project description (optional)"
                    value={description}
                    onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                        setErrors({ ...errors, description: null });
                    }}
                    rows={3}
                />

                <div className="flex justify-between mt-1">
                    {errors.description ? (
                    <p className="text-sm text-red-600">
                        {errors.description}
                    </p>
                    ) : (
                    <span />
                    )}

                    <p
                    className={`text-sm ${
                        countWords(description) > 100
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                    >
                    {countWords(description)} / 100 words
                    </p>
                </div>
            </div>

          

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
                type="submit"
                disabled={creating}
                className={`px-4 py-2 rounded text-white ${
                    creating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                >
                {creating ? "Creating..." : "Create"}
            </button>
            
          </div>
        </form>
      </Modal>
      {/* Delete Confirmation Modal */}
    <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
    <h3 className="text-lg font-semibold mb-3">Delete Project</h3>

    <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this project?
        <br />
        <span className="text-red-600">
        All tasks under this project will also be deleted.
        </span>
    </p>

    <div className="flex justify-end gap-2">
        <button
        onClick={() => setDeleteId(null)}
        className="px-4 py-2 text-gray-600"
        >
        Cancel
        </button>
        <button
            onClick={deleteProject}
            disabled={deleting}
            className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
                deleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
            >
            {deleting ? (
                <>
                <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    />
                    <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
                Deleting…
                </>
            ) : (
                <>
                <FiTrash2 size={16} />
                Delete
                </>
            )}
        </button>

         
    </div>
    </Modal>
     {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow text-white ${
            toast.type === "error"
              ? "bg-red-600"
              : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
