import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  isOverlay = false,
  deleting = false,
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow p-3 space-y-1 cursor-grab
        ${isOverlay ? "opacity-90 scale-105 shadow-xl" : ""}
      `}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h4 className="font-medium text-sm">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-gray-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 text-gray-500">
          <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              <FiEdit2 />
          </button>
          <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
            >
              <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
