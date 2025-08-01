import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Header from "@/components/layout/header";
import ProjectCard from "@/components/project-card";
import ProjectModal from "@/components/modals/project-modal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project, Task } from "@shared/schema";

export default function Projects() {
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const getTasksForProject = (projectId: string) => 
    tasks.filter(task => task.projectId === projectId);

  const filteredProjects = projects.filter(project => {
    if (statusFilter === "all") return true;
    return project.status === statusFilter;
  });

  return (
    <>
      <Header
        title="Projetos"
        onNewProject={() => setProjectModalOpen(true)}
        showNewProject
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="dark:text-white font-normal text-[20px] text-[#d4d2d2]">Selecione:</h2>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="in-progress">Em progresso</SelectItem>
                  <SelectItem value="review">Em análise</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="on-hold">Em pausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={getTasksForProject(project.id)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum projeto encontrado</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {statusFilter === "all" 
                ? "Comece criando seu primeiro projeto" 
                : "Tente alterar o filtro de status"}
            </p>
          </div>
        )}
      </div>
      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
      />
    </>
  );
}
