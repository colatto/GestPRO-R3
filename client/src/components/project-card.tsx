import { MoreHorizontalIcon, BriefcaseIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Project, Task } from "@shared/schema";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onClick?: () => void;
}

const colorMap = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  pink: "bg-pink-500",
};

const statusMap = {
  planning: { label: "Planejamento", variant: "secondary" as const },
  active: { label: "Ativo", variant: "default" as const },
  completed: { label: "Concluído", variant: "default" as const },
  on_hold: { label: "Pausado", variant: "outline" as const },
};

export default function ProjectCard({ project, tasks, onClick }: ProjectCardProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const iconColor = colorMap[project.color as keyof typeof colorMap] || colorMap.blue;
  const status = statusMap[project.status as keyof typeof statusMap] || statusMap.planning;

  return (
    <Link href={`/projects/${project.id}`}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center`}>
                <BriefcaseIcon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Criado em {format(new Date(project.createdAt), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="text-gray-400" size={16} />
            </Button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Progress value={progress} className="w-20" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{progress}%</span>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{totalTasks} tarefas</span>
            <span>
              <ClockIcon size={12} className="inline mr-1" />
              Atualizado {format(new Date(project.updatedAt), "dd/MM")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}