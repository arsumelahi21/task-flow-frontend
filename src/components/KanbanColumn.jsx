import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";


export default function KanbanColumn({ title, status, tasks, onDelete,
  onEdit,  }) {
  const { setNodeRef } = useDroppable({
    id: status, 
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 rounded-lg p-4 min-h-[300px]"
    >
      <h3 className="font-semibold mb-4">{title}</h3>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-sm text-gray-400 text-center">
              No tasks
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={onDelete}
              onEdit={onEdit}/>
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
