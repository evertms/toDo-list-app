import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate= useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">To Do-List</h1>
      <p className="text-lg text-center max-w-md mb-12">
        To Do-List es una app para organizar tu tiempo y tus tareas. Pensado para que dejes de procrastinar y empieces a ser productivo.
      </p>
      <div className="flex space-x-4">
        <Button text="Login" onClick={() => navigate('/login')} />
        <Button text="Registro" onClick={() => navigate('/register')} />
      </div>
    </div>
  );
};

export default LandingPage;