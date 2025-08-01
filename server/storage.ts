import { type Project, type Task, type InsertProject, type InsertTask } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  getTasksByProject(projectId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // User management (keeping existing interface)
  getUser(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private tasks: Map<string, Task>;
  private users: Map<string, any>;

  constructor() {
    this.projects = new Map();
    this.tasks = new Map();
    this.users = new Map();
    this.seedData();
  }

  private seedData() {
    // Create sample projects
    const sampleProjects: Project[] = [
      {
        id: "1",
        name: "Sistema de E-commerce",
        description: "Desenvolvimento completo de plataforma de e-commerce com painel administrativo e integração de pagamentos.",
        status: "in-progress",
        color: "blue",
        dueDate: new Date("2024-12-15"),
        createdAt: new Date("2024-11-01"),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "App Mobile TaskFlow",
        description: "Aplicativo mobile nativo para iOS e Android com sincronização em tempo real e modo offline.",
        status: "review",
        color: "green",
        dueDate: new Date("2024-12-18"),
        createdAt: new Date("2024-10-15"),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Dashboard Analytics",
        description: "Sistema de analytics com visualizações interativas e relatórios automatizados para gestão.",
        status: "completed",
        color: "purple",
        dueDate: new Date("2024-11-30"),
        createdAt: new Date("2024-09-20"),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Sistema de Segurança",
        description: "Implementação de autenticação multi-fator e monitoramento de segurança em tempo real.",
        status: "planning",
        color: "red",
        dueDate: new Date("2024-12-20"),
        createdAt: new Date("2024-11-25"),
        updatedAt: new Date(),
      },
    ];

    sampleProjects.forEach(project => this.projects.set(project.id, project));

    // Create sample tasks
    const sampleTasks: Task[] = [
      {
        id: "t1",
        projectId: "1",
        title: "Implementar autenticação OAuth",
        description: "Integrar sistema de login social com Google, Facebook e GitHub para facilitar o acesso dos usuários.",
        status: "in-progress",
        priority: "high",
        completed: false,
        assignee: "João Silva",
        dueDate: new Date("2024-12-15"),
        createdAt: new Date("2024-11-01"),
        updatedAt: new Date(),
      },
      {
        id: "t2",
        projectId: "2",
        title: "Design da tela de login mobile",
        description: "Criar interface responsiva e intuitiva para autenticação em dispositivos móveis.",
        status: "todo",
        priority: "medium",
        completed: false,
        assignee: "Maria Santos",
        dueDate: new Date("2024-12-18"),
        createdAt: new Date("2024-11-02"),
        updatedAt: new Date(),
      },
      {
        id: "t3",
        projectId: "3",
        title: "Configurar métricas de performance",
        description: "Implementar sistema de monitoramento e coleta de métricas de performance da aplicação.",
        status: "completed",
        priority: "low",
        completed: true,
        assignee: "Pedro Costa",
        dueDate: new Date("2024-11-29"),
        createdAt: new Date("2024-11-03"),
        updatedAt: new Date(),
      },
      {
        id: "t4",
        projectId: "4",
        title: "Implementar criptografia de dados",
        description: "Adicionar camada de criptografia para proteger dados sensíveis dos usuários.",
        status: "todo",
        priority: "high",
        completed: false,
        assignee: "Ana Silva",
        dueDate: new Date("2024-12-20"),
        createdAt: new Date("2024-11-04"),
        updatedAt: new Date(),
      },
    ];

    sampleTasks.forEach(task => this.tasks.set(task.id, task));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      description: insertProject.description || null,
      status: insertProject.status || "planning",
      color: insertProject.color || "blue",
      dueDate: insertProject.dueDate || null,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    // Also delete all tasks associated with this project
    const tasks = Array.from(this.tasks.values()).filter(task => task.projectId === id);
    tasks.forEach(task => this.tasks.delete(task.id));
    
    return this.projects.delete(id);
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.projectId === projectId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      description: insertTask.description || null,
      priority: insertTask.priority || "medium",
      status: insertTask.status || "todo",
      completed: insertTask.completed || false,
      assignee: insertTask.assignee || null,
      dueDate: insertTask.dueDate || null,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // User management (keeping existing interface)
  async getUser(id: string): Promise<any> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
