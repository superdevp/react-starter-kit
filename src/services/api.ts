import type { Project, Task, User, ApiResponse, ProjectFormData, TaskFormData } from '../types';
import { mockProjects, mockUser } from './mockData';

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'react_starter_kit_projects',
  USER: 'react_starter_kit_user',
  AUTH_TOKEN: 'react_starter_kit_token',
} as const;

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let projects: Project[] = getFromStorage(STORAGE_KEYS.PROJECTS, mockProjects);
let currentUser: User | null = getFromStorage(STORAGE_KEYS.USER, null);

const saveProjects = () => setToStorage(STORAGE_KEYS.PROJECTS, projects);
const saveUser = () => setToStorage(STORAGE_KEYS.USER, currentUser);

export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    await delay(800);
    
    if (email && password) {
      currentUser = mockUser;
      saveUser();
      setToStorage(STORAGE_KEYS.AUTH_TOKEN, 'mock-jwt-token');
      
      return {
        success: true,
        data: currentUser,
        message: 'Login successful',
      };
    }
    
    throw new Error('Invalid credentials');
  },

  logout: async (): Promise<void> => {
    await delay(300);
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getCurrentUser: (): User | null => {
    return currentUser;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<ApiResponse<Project[]>> => {
    await delay(500);
    return {
      success: true,
      data: projects,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Project>> => {
    await delay(300);
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return {
      success: true,
      data: project,
    };
  },

  create: async (data: ProjectFormData): Promise<ApiResponse<Project>> => {
    await delay(600);
    
    const newProject: Project = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: currentUser?.id || '1',
      tasks: [],
    };
    
    projects.push(newProject);
    saveProjects();
    
    return {
      success: true,
      data: newProject,
      message: 'Project created successfully',
    };
  },

  update: async (id: string, data: Partial<ProjectFormData>): Promise<ApiResponse<Project>> => {
    await delay(500);
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveProjects();
    
    return {
      success: true,
      data: projects[projectIndex],
      message: 'Project updated successfully',
    };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(400);
    
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    projects.splice(projectIndex, 1);
    saveProjects();
    
    return {
      success: true,
      data: undefined,
      message: 'Project deleted successfully',
    };
  },
};

// Tasks API
export const tasksAPI = {
  create: async (projectId: string, data: TaskFormData): Promise<ApiResponse<Task>> => {
    await delay(500);
    
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      status: 'pending',
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    project.tasks.push(newTask);
    project.updatedAt = new Date().toISOString();
    saveProjects();
    
    return {
      success: true,
      data: newTask,
      message: 'Task created successfully',
    };
  },

  update: async (taskId: string, data: Partial<TaskFormData & { status?: 'pending' | 'completed' }>): Promise<ApiResponse<Task>> => {
    await delay(400);
    
    let task: Task | undefined;
    let project: Project | undefined;
    
    // Find the task and its project
    for (const p of projects) {
      const taskIndex = p.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        project = p;
        task = p.tasks[taskIndex];
        break;
      }
    }
    
    if (!task || !project) {
      throw new Error('Task not found');
    }
    
    const taskIndex = project.tasks.findIndex(t => t.id === taskId);
    project.tasks[taskIndex] = {
      ...task,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    project.updatedAt = new Date().toISOString();
    saveProjects();
    
    return {
      success: true,
      data: project.tasks[taskIndex],
      message: 'Task updated successfully',
    };
  },

  delete: async (taskId: string): Promise<ApiResponse<void>> => {
    await delay(300);
    
    let project: Project | undefined;
    
    // Find the project containing the task
    for (const p of projects) {
      const taskIndex = p.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        project = p;
        p.tasks.splice(taskIndex, 1);
        p.updatedAt = new Date().toISOString();
        break;
      }
    }
    
    if (!project) {
      throw new Error('Task not found');
    }
    
    saveProjects();
    
    return {
      success: true,
      data: undefined,
      message: 'Task deleted successfully',
    };
  },

  toggleStatus: async (taskId: string): Promise<ApiResponse<Task>> => {
    await delay(300);
    
    let task: Task | undefined;
    let project: Project | undefined;
    
    // Find the task and its project
    for (const p of projects) {
      const taskIndex = p.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        project = p;
        task = p.tasks[taskIndex];
        break;
      }
    }
    
    if (!task || !project) {
      throw new Error('Task not found');
    }
    
    const taskIndex = project.tasks.findIndex(t => t.id === taskId);
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    project.tasks[taskIndex] = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    
    project.updatedAt = new Date().toISOString();
    saveProjects();
    
    return {
      success: true,
      data: project.tasks[taskIndex],
      message: `Task marked as ${newStatus}`,
    };
  },
}; 