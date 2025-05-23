
import React from 'react';

const PasswordRequirements = () => {
  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <p>A senha deve conter:</p>
      <ul className="list-disc pl-4 space-y-0.5">
        <li>Pelo menos 6 caracteres</li>
        <li>Pelo menos um número</li>
      </ul>
    </div>
  );
};

export default PasswordRequirements;
