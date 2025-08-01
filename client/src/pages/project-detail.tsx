import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  BriefcaseIcon, 
  PlusIcon,
  EditIcon,
  ClockIcon,
  CheckCircleIcon,
  CircleIcon,
  AlertCircleIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import TaskItem from "@/components/task-item";
import ProjectModal from "@/components/modals/project-modal";
import TaskModal from "@/components/modals/task-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project, Task } from "@shared/schema";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id;
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const projectTasks = tasks.filter(task => task.projectId === projectId);

  const updateTask = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const response = await apiRequest("PUT", `/api/tasks/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask.mutate({
      id: taskId,
      data: { 
        completed,
        status: completed ? "completed" : "todo"
      },
    });
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Carregando..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Carregando projeto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Projeto não encontrado" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Projeto não encontrado
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              O projeto que você está procurando não existe ou foi removido.
            </p>
            <Link href="/projects">
              <Button>
                <ArrowLeftIcon size={16} className="mr-2" />
                Voltar aos Projetos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
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

  const iconColor = colorMap[project.color as keyof typeof colorMap] || colorMap.blue;
  const status = statusMap[project.status as keyof typeof statusMap] || statusMap.planning;

  const completedTasks = projectTasks.filter(task => task.completed).length;
  const totalTasks = projectTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = projectTasks.filter(task => task.priority === "high" && !task.completed).length;
  const overdueTasks = projectTasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title={project.name} />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Project Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon size={16} className="mr-2" />
                Voltar aos Projetos
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditProjectModalOpen(true)}
              >
                <EditIcon size={16} className="mr-2" />
                Editar Projeto
              </Button>
              <Button 
                size="sm"
                onClick={() => setNewTaskModalOpen(true)}
              >
                <PlusIcon size={16} className="mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${iconColor} rounded-xl flex items-center justify-center`}>
                  <BriefcaseIcon className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      Criado em {format(new Date(project.createdAt), "dd/MM/yyyy")}
                    </span>
                    <span className="flex items-center">
                      <ClockIcon size={14} className="mr-1" />
                      Atualizado {format(new Date(project.updatedAt), "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Tarefas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CircleIcon className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alta Prioridade</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{highPriorityTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <AlertCircleIcon className="text-orange-600 dark:text-orange-400" size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Atrasadas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    <ClockIcon className="text-red-600 dark:text-red-400" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-4">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {completedTasks} de {totalTasks} tarefas concluídas
              </span>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tarefas do Projeto
              </h2>
              <Button 
                size="sm"
                onClick={() => setNewTaskModalOpen(true)}
              >
                <PlusIcon size={16} className="mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          <div className="p-6">
            {projectTasks.length > 0 ? (
              <div className="space-y-4">
                {projectTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    project={project}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CircleIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma tarefa ainda
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Comece criando a primeira tarefa para este projeto.
                </p>
                <Button onClick={() => setNewTaskModalOpen(true)}>
                  <PlusIcon size={16} className="mr-2" />
                  Criar Primeira Tarefa
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProjectModal
        open={editProjectModalOpen}
        onOpenChange={setEditProjectModalOpen}
        project={project}
        isEdit={true}
      />

      <TaskModal
        open={newTaskModalOpen}
        onOpenChange={setNewTaskModalOpen}
        defaultProjectId={projectId}
      />
    </div>
  );
}