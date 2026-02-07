import { motion } from 'framer-motion';
import { Plus, Play } from 'lucide-react';
import { slideUp } from '../lib/animations';

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      {...slideUp}
    >
      {children}
    </motion.div>
  );
}

function CTA({ onClick, label, icon: Icon }: { onClick?: () => void; label: string; icon: React.ElementType }) {
  if (!onClick) return null;
  return (
    <button
      onClick={onClick}
      className="mt-4 px-4 py-2 text-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-md inline-flex items-center gap-2"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export function EmptyTasksState({ onCreateTask }: { onCreateTask?: () => void }) {
  return (
    <Wrapper>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4">
        <rect x="12" y="8" width="40" height="48" rx="4" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        <rect x="12" y="8" width="40" height="12" rx="4" className="fill-indigo-100 dark:fill-indigo-900/50" />
        <line x1="20" y1="30" x2="44" y2="30" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="38" x2="38" y2="38" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="46" x2="34" y2="46" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="30" r="1.5" className="fill-indigo-400 dark:fill-indigo-500" />
        <circle cx="20" cy="38" r="1.5" className="fill-indigo-400 dark:fill-indigo-500" />
        <circle cx="20" cy="46" r="1.5" className="fill-indigo-400 dark:fill-indigo-500" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No tasks yet</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your first task to get started</p>
      <CTA onClick={onCreateTask} label="Create Task" icon={Plus} />
    </Wrapper>
  );
}

export function EmptyProjectsState({ onCreateProject }: { onCreateProject?: () => void }) {
  return (
    <Wrapper>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4">
        <path d="M8 20C8 17.7909 9.79086 16 12 16H24L28 12H52C54.2091 12 56 13.7909 56 16V48C56 50.2091 54.2091 52 52 52H12C9.79086 52 8 50.2091 8 48V20Z" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        <path d="M8 24H56" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        <rect x="24" y="32" width="16" height="2" rx="1" className="fill-indigo-300 dark:fill-indigo-600" />
        <rect x="31" y="35" width="2" height="10" rx="1" className="fill-indigo-300 dark:fill-indigo-600" />
        <rect x="24" y="35" width="16" height="2" rx="1" className="fill-indigo-300 dark:fill-indigo-600" transform="rotate(90 32 36)" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No projects yet</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a project to organize your work</p>
      <CTA onClick={onCreateProject} label="Create Project" icon={Plus} />
    </Wrapper>
  );
}

export function EmptyCalendarState() {
  return (
    <Wrapper>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4">
        <rect x="8" y="16" width="48" height="40" rx="4" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        <line x1="8" y1="28" x2="56" y2="28" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        <line x1="20" y1="12" x2="20" y2="20" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" />
        <line x1="44" y1="12" x2="44" y2="20" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="40" r="6" className="stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="2" />
        <line x1="32" y1="37" x2="32" y2="40" className="stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="40" x2="35" y2="40" className="stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No tasks with due dates</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add due dates to your tasks to see them on the calendar</p>
    </Wrapper>
  );
}

export function EmptyTimeEntriesState({ onStartTimer }: { onStartTimer?: () => void }) {
  return (
    <Wrapper>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4">
        <circle cx="32" cy="34" r="20" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        <circle cx="32" cy="34" r="2" className="fill-indigo-400 dark:fill-indigo-500" />
        <line x1="32" y1="22" x2="32" y2="34" className="stroke-indigo-400 dark:stroke-indigo-500" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="34" x2="40" y2="38" className="stroke-indigo-300 dark:stroke-indigo-600" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="14" x2="32" y2="10" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="10" x2="38" y2="10" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No time tracked yet</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start a timer or add a manual entry</p>
      <CTA onClick={onStartTimer} label="Start Timer" icon={Play} />
    </Wrapper>
  );
}
