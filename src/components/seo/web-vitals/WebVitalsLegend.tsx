
import React from 'react';

const WebVitalsLegend: React.FC = () => {
  return (
    <div className="text-xs text-gray-500 mt-2">
      <p>
        <span className="font-medium">Bom:</span> LCP ≤ 2,5s • CLS ≤ 0,1 • FID ≤ 100ms
      </p>
      <p>
        <span className="font-medium">Precisa melhorar:</span> LCP ≤ 4,0s • CLS ≤ 0,25 • FID ≤ 300ms
      </p>
      <p>
        <span className="font-medium">Ruim:</span> LCP {">"} 4,0s • CLS {">"} 0,25 • FID {">"} 300ms
      </p>
    </div>
  );
};

export default WebVitalsLegend;
