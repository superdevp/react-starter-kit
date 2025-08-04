import React from 'react';
import { Calendar, Clock, CheckCircle, Circle } from 'lucide-react';
import { clsx } from 'clsx';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onEdit,
  onDelete,
}) => {
  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer group">
      <div onClick={onClick} className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Edit project"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete project"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={clsx(
                'h-2 rounded-full transition-all duration-300',
                progressPercentage === 100
                  ? 'bg-green-500'
                  : progressPercentage > 50
                  ? 'bg-blue-500'
                  : 'bg-yellow-500'
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Task preview */}
        {project.tasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recent tasks
            </h4>
            <div className="space-y-1">
              {project.tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center space-x-2 text-sm">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={clsx(
                    'truncate',
                    task.status === 'completed'
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-700 dark:text-gray-300'
                  )}>
                    {task.title}
                  </span>
                </div>
              ))}
              {project.tasks.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  +{project.tasks.length - 3} more tasks
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Updated {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 