import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTaskMutations } from '../hooks/useTaskMutations';
import TaskView from '../components/TaskView';

const Dashboard: React.FC = () => {
  const { tasks, setTasks, loading, error } = useTasks();
  const { toggleComplete, editTask, deleteTask } = useTaskMutations(setTasks);

  return (
    <TaskView
      title="Todas tus tareas"
      tasks={tasks}
      loading={loading}
      error={error}
      onToggleComplete={toggleComplete}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
};

export default Dashboard;