import { SearchIcon, BellIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../theme-toggle";

interface HeaderProps {
  title: string;
  onNewProject?: () => void;
  onNewTask?: () => void;
  showNewProject?: boolean;
  showNewTask?: boolean;
}

export default function Header({ 
  title, 
  onNewProject, 
  onNewTask, 
  showNewProject = false, 
  showNewTask = false 
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400 dark:text-gray-500" size={16} />
              </div>
              <Input
                type="text"
                className="w-80 pl-10"
                placeholder="Buscar projetos e tarefas..."
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <BellIcon className="text-gray-400 dark:text-gray-500" size={20} />
          </Button>
          {showNewProject && (
            <Button onClick={onNewProject}>
              <PlusIcon size={16} className="mr-2" />
              Novo Projeto
            </Button>
          )}
          {showNewTask && (
            <Button onClick={onNewTask}>
              <PlusIcon size={16} className="mr-2" />
              Nova Tarefa
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
