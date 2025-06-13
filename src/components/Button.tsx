import React from 'react';

type ButtonProps = {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ text, onClick, isLoading = false }) => {
  const getButtonStyle = () => {
    switch (text) {
      case 'Hecha':
        return 'bg-green-500 hover:bg-green-700';
      case 'Eliminar':
        return 'bg-red-500 hover:bg-red-700';
      case 'No hecha':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-500 hover:bg-blue-700';
    }
  };

  const baseStyle = 'text-white font-bold py-2 px-4 rounded-full transition-colors duration-200';

  return (
    <button
      className={`${getButtonStyle()} ${baseStyle} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={isLoading ? undefined : onClick}
      disabled={isLoading}
    >
      {isLoading ? 'Iniciando...' : text}
    </button>
  );
};

export default Button;