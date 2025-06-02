import React, { useState } from 'react';
import { fetchRoofData, fetchSystemSize, fetchOpenAIPlacement } from '../utils/apiClient';

const SolarPlanner: React.FC = () => {
  const [address, setAddress] = useState('');
  const [roofData, setRoofData] = useState(null);
  const [systemSize, setSystemSize] = useState<number | null>(null);
  const [layout, setLayout] = useState(null);

  const handleAnalyze = async () => {
    try {
      const roof = await fetchRoofData(address);
      setRoofData(roof);

      const system = await fetchSystemSize(address);
      setSystemSize(system.systemSizeKw);

      const panelLayout = await fetchOpenAIPlacement(roof, system.systemSizeKw);
      setLayout(panelLayout);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  return (
    <div>
      <h1>Solar Panel Planner</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address"
      />
      <button onClick={handleAnalyze}>Analyze Roof</button>

      {layout && (
        <div>
          <h2>Panel Layout</h2>
          <pre>{JSON.stringify(layout, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SolarPlanner;
