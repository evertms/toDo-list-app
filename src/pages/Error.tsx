import React from 'react';

const Error: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-500">Acceso no autorizado o página no encontrada</h1>
    </div>
  );
};

export default Error;