import { Link, useLocation } from "wouter";
import { FolderIcon, CheckSquareIcon, ChartPieIcon, ListTodo, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: ChartPieIcon,
      current: location === "/",
    },
    {
      name: "Projetos",
      href: "/projects",
      icon: FolderIcon,
      current: location === "/projects",
    },
    {
      name: "Todas as Tarefas",
      href: "/tasks",
      icon: CheckSquareIcon,
      current: location === "/tasks",
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ListTodo className="text-white" size={16} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">TaskFlow</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg font-medium transition-colors",
                  item.current
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <UserIcon className="text-gray-600" size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">João Silva</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">joao@empresa.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
