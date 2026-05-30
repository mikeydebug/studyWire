import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        if (response.data.success) {
          setHealthStatus('Backend Connected: ' + response.data.message);
        } else {
          setHealthStatus('Backend responded with error.');
        }
      } catch (error) {
        setHealthStatus('Backend Connection Failed: ' + error.message);
      }
    };
    
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-md w-full shadow-2xl text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent mb-4">
          StudyWire
        </h1>
        <p className="text-slate-300">
          {healthStatus}
        </p>
      </div>
    </div>
  );
}

export default App;
