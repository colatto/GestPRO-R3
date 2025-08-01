import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FolderIcon, ClockIcon, CheckCircleIcon, TrendingUpIcon, ArrowRightIcon } from "lucide-react";
import Header from "@/components/layout/header";
import StatsCard from "@/components/stats-card";
import ProjectCard from "@/components/project-card";
import TaskItem from "@/components/task-item";
import ProjectModal from "@/components/modals/project-modal";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Project, Task } from "@shared/schema";

interface Stats {
  totalProjects: number;
  activeTasks: number;
  completedTasks: number;
  completionRate: number;
}

export default function Dashboard() {
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const recentProjects = projects.slice(0, 3);
  const recentTasks = tasks.slice(0, 3);

  const getTasksForProject = (projectId: string) => 
    tasks.filter(task => task.projectId === projectId);

  return (
    <>
      <Header
        title="Dashboard"
        onNewProject={() => setProjectModalOpen(true)}
        showNewProject
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Projetos"
            value={stats?.totalProjects || 0}
            change="+2 este mês"
            changeType="positive"
            icon={FolderIcon}
            iconColor="bg-blue-50 text-blue-500"
          />
          <StatsCard
            title="Tarefas Ativas"
            value={stats?.activeTasks || 0}
            change="+5 desde ontem"
            changeType="positive"
            icon={ClockIcon}
            iconColor="bg-yellow-50 text-yellow-500"
          />
          <StatsCard
            title="Concluídas"
            value={stats?.completedTasks || 0}
            change="+12 esta semana"
            changeType="positive"
            icon={CheckCircleIcon}
            iconColor="bg-green-50 text-green-500"
          />
          <StatsCard
            title="Taxa de Conclusão"
            value={`${stats?.completionRate || 0}%`}
            change="+3% vs. mês anterior"
            changeType="positive"
            icon={TrendingUpIcon}
            iconColor="bg-purple-50 text-purple-500"
          />
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projetos Recentes</h3>
              <Link href="/projects">
                <Button variant="ghost" className="text-primary">
                  Ver todos <ArrowRightIcon size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={getTasksForProject(project.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tarefas Recentes</h3>
              <Link href="/tasks">
                <Button variant="ghost" className="text-primary">
                  Ver todas <ArrowRightIcon size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <TaskItem
                    key={task.id}
                    task={task}
                    project={project}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
      />
    </>
  );
}
