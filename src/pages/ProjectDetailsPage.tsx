import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Filter, CheckCircle, Circle, Calendar } from 'lucide-react';
import { projectsAPI, tasksAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import type { Project, Task, TaskFormData, FormErrors } from '../types';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Task modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium'
  });
  const [taskErrors, setTaskErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTasks, setSubmittedTasks] = useState<Set<string>>(new Set());
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsAPI.getById(id);
      if (response.success && response.data) {
        setProject(response.data);
        setTasks(response.data.tasks || []);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    // Create a unique key for this submission to prevent duplicates
    const submissionKey = `${taskForm.title}-${taskForm.description}-${taskForm.dueDate}-${Date.now()}`;
    
    // Check if this exact submission is already being processed
    if (submittedTasks.has(submissionKey)) {
      return;
    }
    
    // Validate form
    const errors: FormErrors = {};
    if (!taskForm.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!taskForm.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setTaskErrors(errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmittedTasks(prev => new Set(prev).add(submissionKey));
      
      if (editingTask) {
        // Update existing task
        const response = await tasksAPI.update(editingTask.id, taskForm);
        if (response.success && response.data) {
          setTasks(tasks.map(task => 
            task.id === editingTask.id ? response.data : task
          ));
        }
      } else {
        // Create new task
        const response = await tasksAPI.create(project!.id, taskForm);
        if (response.success && response.data) {
          // Check if task already exists to prevent duplicates
          setTasks(prev => {
            const exists = prev.some(t => t.id === response.data.id);
            if (exists) {
              return prev;
            }
            return [...prev, response.data];
          });
        }
      }
      
      closeTaskModal();
    } catch (err) {
      setTaskErrors({ general: 'Failed to save task' });
    } finally {
      setIsSubmitting(false);
      // Clean up the submission key after a delay
      setTimeout(() => {
        setSubmittedTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(submissionKey);
          return newSet;
        });
      }, 1000);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await tasksAPI.delete(taskId);
      if (response.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    try {
      const response = await tasksAPI.toggleStatus(taskId);
      if (response.success && response.data) {
        setTasks(tasks.map(task => 
          task.id === taskId ? response.data : task
        ));
      }
    } catch (err) {
      console.error('Failed to toggle task status:', err);
    }
  };

  const openTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        priority: task.priority
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        priority: 'medium'
      });
    }
    setTaskErrors({});
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium'
    });
    setTaskErrors({});
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Project not found'}
          </h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {project.description}
              </p>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
          
          {/* Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tasks
              </h2>
              <div className="flex items-center space-x-3">
                {/* Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                
                {/* Add Task Button */}
                <Button onClick={() => openTaskModal()} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status:
                  </span>
                  {(['all', 'pending', 'completed'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tasks List */}
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Circle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {filterStatus === 'all' ? 'No tasks yet' : `No ${filterStatus} tasks`}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {filterStatus === 'all' 
                    ? 'Get started by creating your first task.'
                    : `No tasks with ${filterStatus} status.`
                  }
                </p>
                {filterStatus === 'all' && (
                  <Button onClick={() => openTaskModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Task
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="mr-4 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Task Info */}
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => openTaskModal(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium text-gray-900 dark:text-white ${
                            task.status === 'completed' ? 'line-through text-gray-500' : ''
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${
                              task.status === 'completed' ? 'line-through' : ''
                            }`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          {/* Due Date */}
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {task.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => openTaskModal(task)}
                        className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          {taskErrors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {taskErrors.general}
              </p>
            </div>
          )}

          <Input
            label="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            error={taskErrors.title}
            required
          />

          <Textarea
            label="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            rows={3}
          />

          <Input
            label="Due Date"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            error={taskErrors.dueDate}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as 'pending' | 'completed' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={closeTaskModal}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? (editingTask ? 'Updating...' : 'Creating...') : (editingTask ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailsPage; 