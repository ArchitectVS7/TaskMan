import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, projectsApi } from '../lib/api';
import CalendarView from '../components/CalendarView';
import { EmptyCalendarState } from '../components/EmptyStates';
import type { Project } from '../types';

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const [projectFilter, setProjectFilter] = useState('');

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.getAll(),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dueDate }: { id: string; dueDate: string }) =>
      tasksApi.update(id, { dueDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleTaskDateChange = (taskId: string, newDate: string) => {
    updateMutation.mutate({ id: taskId, dueDate: newDate });
  };

  // Filter to tasks with due dates, optionally by project
  const filteredTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    if (projectFilter && t.projectId !== projectFilter) return false;
    return true;
  });

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
        <div>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">All Projects</option>
            {projects.map((p: Project) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyCalendarState />
      ) : (
        <CalendarView
          tasks={filteredTasks}
          onTaskDateChange={handleTaskDateChange}
        />
      )}
    </div>
  );
}
