
import React from 'react';

const SpamInstructions = () => {
  return (
    <div className="text-sm text-muted-foreground mt-4">
      <p className="font-medium">Não recebeu o email?</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Verifique a sua pasta de spam ou lixo eletrónico</li>
        <li>Adicione no-reply@seoaudit.pt aos seus contactos</li>
        <li>Aguarde alguns minutos, pois os emails podem demorar a chegar</li>
      </ul>
    </div>
  );
};

export default SpamInstructions;
