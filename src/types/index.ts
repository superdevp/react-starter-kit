export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
} 