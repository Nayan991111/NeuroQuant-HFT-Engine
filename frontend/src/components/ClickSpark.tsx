import React, { useState, useEffect } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
}

export const ClickSpark: React.FC = () => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSpark = { id: Date.now(), x: e.pageX, y: e.pageY };
      
      // Add spark to state
      setSparks((prev) => [...prev, newSpark]);

      // Remove spark after animation (600ms) to prevent memory leaks
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, 600);
    };

    // Attach listener to the entire window
    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="absolute inline-block rounded-full bg-blue-400 opacity-75"
          style={{
            left: spark.x,
            top: spark.y,
            width: '10px',
            height: '10px',
            transform: 'translate(-50%, -50%)', // Center on cursor
            animation: 'ping 0.6s cubic-bezier(0, 0, 0.2, 1) forwards',
          }}
        />
      ))}
    </div>
  );
};