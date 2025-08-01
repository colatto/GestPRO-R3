import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CalendarIcon, 
  UserIcon, 
  FolderIcon, 
  EditIcon,
  CheckCircle2Icon,
  CircleIcon,
  AlertCircleIcon,
  ClockIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/header";
import TaskModal from "@/components/modals/task-modal";
import { Task, Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const priorityMap = {
  low: { label: "Baixa", variant: "secondary" as const, icon: CircleIcon },
  medium: { label: "Média", variant: "default" as const, icon: AlertCircleIcon },
  high: { label: "Alta", variant: "destructive" as const, icon: AlertCircleIcon },
};

const statusMap = {
  todo: { label: "A Fazer", variant: "secondary" as const },
  "in-progress": { label: "Em Progresso", variant: "default" as const },
  review: { label: "Em Revisão", variant: "secondary" as const },
  completed: { label: "Concluída", variant: "default" as const },
};

export default function TaskDetail() {
  const { id } = useParams();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ["/api/tasks", id],
    enabled: !!id,
  });

  const { data: project } = useQuery<Project>({
    queryKey: ["/api/projects", task?.projectId],
    enabled: !!task?.projectId,
  });

  const updateTask = useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await apiRequest("PUT", `/api/tasks/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Tarefa atualizada com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar tarefa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleComplete = () => {
    if (!task) return;
    
    updateTask.mutate({
      completed: !task.completed,
      status: !task.completed ? "completed" : "todo"
    });
  };

  if (isLoading) {
    return (
      <>
        <Header title="Detalhes da Tarefa" />
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          </div>
        </div>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Header title="Tarefa não encontrada" />
        <div className="flex-1 overflow-auto p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Tarefa não encontrada</p>
          </div>
        </div>
      </>
    );
  }

  const priority = priorityMap[task.priority as keyof typeof priorityMap] || priorityMap.medium;
  const status = statusMap[task.status as keyof typeof statusMap] || statusMap.todo;
  const PriorityIcon = priority.icon;

  return (
    <>
      <Header title="Detalhes da Tarefa" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Task Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      onClick={handleToggleComplete}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2Icon size={24} />
                      ) : (
                        <CircleIcon size={24} />
                      )}
                    </button>
                    <CardTitle className={cn(
                      "text-2xl",
                      task.completed && "line-through opacity-60"
                    )}>
                      {task.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={priority.variant} className="flex items-center space-x-1">
                      <PriorityIcon size={12} />
                      <span>{priority.label}</span>
                    </Badge>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>
                <Button onClick={() => setEditModalOpen(true)} className="flex items-center space-x-2">
                  <EditIcon size={16} />
                  <span>Editar</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {task.description && (
                <p className={cn(
                  "text-gray-600 dark:text-gray-300 mb-4",
                  task.completed && "line-through opacity-60"
                )}>
                  {task.description}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Project */}
                <div className="flex items-center space-x-2 text-sm">
                  <FolderIcon size={16} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Projeto</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {project?.name || "Carregando..."}
                    </p>
                  </div>
                </div>

                {/* Assignee */}
                <div className="flex items-center space-x-2 text-sm">
                  <UserIcon size={16} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Responsável</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {task.assignee || "Não atribuído"}
                    </p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center space-x-2 text-sm">
                  <CalendarIcon size={16} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Prazo</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {task.dueDate ? format(new Date(task.dueDate), "dd/MM/yyyy") : "Sem prazo"}
                    </p>
                  </div>
                </div>

                {/* Created */}
                <div className="flex items-center space-x-2 text-sm">
                  <ClockIcon size={16} className="text-gray-500" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Criado em</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(task.createdAt), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task History or Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Última atualização</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {format(new Date(task.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status da tarefa</p>
                  <div className="flex items-center space-x-2">
                    {task.completed ? (
                      <CheckCircle2Icon size={16} className="text-green-500" />
                    ) : (
                      <CircleIcon size={16} className="text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.completed ? "Concluída" : "Pendente"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        task={task}
        isEdit={true}
      />
    </>
  );
}