
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Carregando dados...</h2>
        <p className="text-muted-foreground">Por favor, aguarde enquanto buscamos as informações.</p>
      </div>
    </div>
  );
};

export default LoadingState;
