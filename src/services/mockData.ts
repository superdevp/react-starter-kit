import type { Project, Task, User } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
};

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Website',
    description: 'Build a modern e-commerce platform with React and Node.js',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    userId: '1',
    tasks: [
      {
        id: '1',
        title: 'Design homepage layout',
        description: 'Create responsive homepage with product grid and search functionality',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-18T23:59:59Z',
        projectId: '1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-17T16:00:00Z',
      },
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'Add login/register functionality with JWT tokens',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-01-25T23:59:59Z',
        projectId: '1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '3',
        title: 'Create product catalog',
        description: 'Build product listing page with filters and pagination',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-01-30T23:59:59Z',
        projectId: '1',
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a cross-platform mobile app using React Native',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
    userId: '1',
    tasks: [
      {
        id: '4',
        title: 'Setup React Native project',
        description: 'Initialize project with TypeScript and navigation',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-12T23:59:59Z',
        projectId: '2',
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-11T15:30:00Z',
      },
      {
        id: '5',
        title: 'Design app screens',
        description: 'Create wireframes and UI mockups for main screens',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-01-22T23:59:59Z',
        projectId: '2',
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-12T14:00:00Z',
      },
    ],
  },
  {
    id: '3',
    title: 'Blog Platform',
    description: 'Develop a content management system for blogging',
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-18T09:45:00Z',
    userId: '1',
    tasks: [
      {
        id: '6',
        title: 'Setup database schema',
        description: 'Design and implement database tables for users, posts, and comments',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-08T23:59:59Z',
        projectId: '3',
        createdAt: '2024-01-05T12:00:00Z',
        updatedAt: '2024-01-07T18:20:00Z',
      },
      {
        id: '7',
        title: 'Create admin dashboard',
        description: 'Build admin interface for managing posts and users',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-01-28T23:59:59Z',
        projectId: '3',
        createdAt: '2024-01-08T10:00:00Z',
        updatedAt: '2024-01-08T10:00:00Z',
      },
      {
        id: '8',
        title: 'Implement comment system',
        description: 'Add commenting functionality with moderation features',
        status: 'pending',
        priority: 'low',
        dueDate: '2024-02-05T23:59:59Z',
        projectId: '3',
        createdAt: '2024-01-10T16:00:00Z',
        updatedAt: '2024-01-10T16:00:00Z',
      },
    ],
  },
];

export const getAllTasks = (): Task[] => {
  return mockProjects.flatMap(project => project.tasks);
};

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getTaskById = (taskId: string): Task | undefined => {
  return getAllTasks().find(task => task.id === taskId);
}; 