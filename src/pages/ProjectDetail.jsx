import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import KanbanColumn from "../components/KanbanColumn";
import Modal from "../components/Modal";
import { FiPlus } from "react-icons/fi";
import { DndContext, closestCenter } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { countWords } from "../utils/projectValidation";
import { DragOverlay } from "@dnd-kit/core";
import TaskCard from "../components/TaskCard";

const STATUS_MAP = {
  pending: "pending",
  completed: "completed",
}
export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");

  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [descError, setDescError] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const projectRes = await api.get(`/projects/${id}`);
      const tasksRes = await api.get(`/tasks/project/${id}`);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch(err) {
       if (err.response?.status === 404) {
          setNotFound(true);
       }
      console.error("Failed to load project or tasks");
    } finally{
      setLoading(false);
    }
  };

 const handleSaveTask = async () => {
    
  if (!taskTitle.trim()) {
    toast.error("Title is required");
    return; 
  }
 
  if (countWords(taskDescription) > 100) {
      toast.error("Description cannot exceed 100 words");
    return; 
  }
  setCreating(true);

  try {
    if (editingTask) {
      
      await api.put(`/tasks/${editingTask.id}`, {
        title: taskTitle.trim(),
        description: taskDescription,
        status: taskStatus,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
              }
            : t
        )
      );

      toast.success("Task updated");
    } else {
    
      const res = await api.post(`/tasks/project/${id}`, {
        title: taskTitle.trim(),
        description: taskDescription,
        status: taskStatus,
      });

      setTasks((prev) => [...prev, res.data]);
      toast.success("Task created");
    }

   
    setShowModal(false);
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("pending");
  } catch {
    toast.error("Failed to save task");
  }
  finally{
    setCreating(false);
  }
};



  // ------------------ TASK DELETE ------------------
  const handleDeleteTask = async () => {
    if (!deleteTask) return;

    try {
      setDeleting(true);
      await api.delete(`/tasks/${deleteTask.id}`);
      setTasks((prev) =>
        prev.filter((t) => t.id !== deleteTask.id)
      );
      toast.success("Task Deleted Successfully");
    } catch {
      console.error("Failed to delete task");
    } finally {
      setDeleting(false);
      setDeleteTask(null);
    }
  };
  const handleEditClick = async (task) => {
     setEditingTask(task);
     setTaskTitle(task.title);
     setTaskDescription(task.description || "");
     setTaskStatus(task.status);
     setShowModal(true); 
   };

const handleDragStart = (event) => {
  const task = tasks.find(
    (t) => String(t.id) === String(event.active.id)
  );
  setActiveTask(task);
};
  // ------------------ DRAG & DROP ------------------
const handleDragEnd = async (event) => {
  const { active, over } = event;
  if (!over) return;

  const taskId = active.id;
  const newStatus = over.id; 


  if (newStatus !== "pending" && newStatus !== "completed") {
    console.error("Invalid drop target:", newStatus);
    return;
  }

  const task = tasks.find(
    (t) => String(t.id) === String(taskId)
  );

  if (!task || task.status === newStatus) return;

  const prevTasks = [...tasks];


  setTasks((prev) =>
    prev.map((t) =>
      t.id === task.id ? { ...t, status: newStatus } : t
    )
  );

  try {
    await api.put(`/tasks/${task.id}`, {
      title: task.title.trim(),
      status: newStatus,
      description: task.description ?? "",
    });
  } catch (err) {
    setTasks(prevTasks);
  }
};

const filteredTasks = tasks.filter((task) => {
  const query = search.toLowerCase();

  return (
    task.title.toLowerCase().includes(query) ||
    (task.description &&
      task.description.toLowerCase().includes(query))
  );
});
  const pendingTasks = filteredTasks.filter(
    (t) => t.status === "pending"
  );
  const completedTasks = filteredTasks.filter(
    (t) => t.status === "completed"
  );

if (loading) {
  return (
    <div className="p-6 text-center text-gray-500">
      Loading project...
    </div>
  );
}

if (notFound) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-2">
        Project not found
      </h2>
      <p className="text-gray-500 mb-4">
        The project you’re looking for does not exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:underline mb-4"
        >
          ← Back to projects
        </button>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
           
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="text-gray-600">
                    {project.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                    setEditingTask(null);        
                    setTaskTitle("");           
                    setTaskDescription("");      
                    setTaskStatus("pending");   
                    setShowModal(true);          
                  }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiPlus />
                New Task
              </button>
            </div>

            {/* Search */}
            <input
              className="w-full md:w-80 mb-6 border rounded px-3 py-2"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

       
            <DndContext
              onDragStart={handleDragStart}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KanbanColumn
                  title="Pending"
                  status="pending"
                  tasks={pendingTasks}
                  onDelete={setDeleteTask}
                  onEdit={handleEditClick}
                />
                <KanbanColumn
                  title="Completed"
                  status="completed"
                  tasks={completedTasks}
                  onDelete={setDeleteTask}
                  onEdit={handleEditClick}
                />
              </div>
             <DragOverlay>
                {activeTask ? (
                <TaskCard 
                
                task={activeTask} isOverlay />
                ) : null}
            </DragOverlay>
            </DndContext>

            {filteredTasks.length === 0 && (
              <p className="text-center text-gray-400 mt-8">
                No tasks found
              </p>
            )}
          </>
        )}
      </main>

      {/* Add/Edit Task Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <h3 className="text-lg font-semibold">
              {editingTask ? "Edit Task" : "Add Task"}
                          </h3>

                          <form onSubmit={(e) => {
                  e.preventDefault();   
                  handleSaveTask();
                }} className="space-y-4">
              
                <div>
                <input
                    className={`w-full border rounded px-3 py-2 ${
                    errors.title ? "border-red-500" : ""
                    }`}
                    placeholder="Title *"
                    value={taskTitle}
                    onChange={(e) => {
                    setTaskTitle(e.target.value);
                    if (errors.title) setErrors({});
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
                        className={`w-full border rounded px-3 py-2 resize-none ${
                        descError ? "border-red-500" : ""
                        }`}
                        rows={3}
                        placeholder="Task description (optional, max 100 words)"
                        value={taskDescription}
                        onChange={(e) => {
                        const value = e.target.value;
                        const words = countWords(value);

                        if (words > 100) {
                            setDescError("Description cannot exceed 100 words");
                        } else {
                            setDescError("");
                        }

                        setTaskDescription(value);
                        }}
                    />

                    <div className="flex justify-between text-xs mt-1">
                        <span className={descError ? "text-red-600" : "text-gray-500"}>
                        {countWords(taskDescription)} / 100 words
                        </span>

                        {descError && (
                        <span className="text-red-600">
                            {descError}
                        </span>
                        )}
                    </div>
                </div>


               
                <div>
                <label className="block text-sm text-gray-600 mb-1">
                    Status
                </label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
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
                        ? "bg-blue-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {creating
                      ? editingTask
                        ? "Updating..."
                        : "Creating..."
                      : editingTask
                        ? "Update Task"
                        : "Create Task"}
                </button>

                </div>
            </form>
        </Modal>

      {/* Delete Task Modal */}
      {deleteTask && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="font-semibold mb-3">
              Delete Task
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this task?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTask(null)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTask}
                disabled={deleting}
                className={`px-4 py-2 rounded text-white ${
                  deleting
                    ? "bg-red-400"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
