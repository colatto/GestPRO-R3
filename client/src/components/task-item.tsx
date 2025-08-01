import { MoreHorizontalIcon, FolderIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Task, Project } from "@shared/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface TaskItemProps {
  task: Task;
  project?: Project;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onClick?: () => void;
}

const priorityMap = {
  low: { label: "Baixa", variant: "secondary" as const },
  medium: { label: "Média", variant: "default" as const },
  high: { label: "Alta", variant: "destructive" as const },
};

const statusMap = {
  todo: { label: "A Fazer", variant: "secondary" as const },
  "in-progress": { label: "Em Progresso", variant: "default" as const },
  review: { label: "Em Revisão", variant: "secondary" as const },
  completed: { label: "Concluída", variant: "default" as const },
};

export default function TaskItem({ task, project, onToggleComplete, onClick }: TaskItemProps) {
  const priority = priorityMap[task.priority as keyof typeof priorityMap] || priorityMap.medium;
  const status = statusMap[task.status as keyof typeof statusMap] || statusMap.todo;

  const handleCheckChange = (checked: boolean) => {
    onToggleComplete?.(task.id, checked);
  };

  return (
    <div
      className={cn(
        "flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-700",
        task.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleCheckChange}
        className="text-primary"
      />
      <div className="flex-1">
        <Link href={`/tasks/${task.id}`}>
          <div className="cursor-pointer" onClick={onClick}>
            <div className="flex items-center space-x-3 mb-2">
              <h4
                className={cn(
                  "font-medium text-gray-900 dark:text-white hover:text-primary transition-colors",
                  task.completed && "line-through"
                )}
              >
                {task.title}
              </h4>
              <Badge variant={priority.variant}>{priority.label}</Badge>
            </div>
            <p
              className={cn(
                "text-sm text-gray-500 dark:text-gray-400 mb-2",
                task.completed && "line-through"
              )}
            >
              {task.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              {project && (
                <span>
                  <FolderIcon size={12} className="inline mr-1" />
                  {project.name}
                </span>
              )}
              {task.dueDate && (
                <span>
                  <CalendarIcon size={12} className="inline mr-1" />
                  Prazo: {format(new Date(task.dueDate), "dd/MM/yyyy")}
                </span>
              )}
              {task.assignee && (
                <span>
                  <UserIcon size={12} className="inline mr-1" />
                  {task.assignee}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
      <Button variant="ghost" size="icon">
        <MoreHorizontalIcon className="text-gray-400" size={16} />
      </Button>
    </div>
  );
}
