import React, { useEffect, useState } from 'react';
import './CapacityAnalysis.css';
import axios from 'axios';
const CapacityAnalysis = () => {
  const [machineAnalysis, setMachineAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
    const fetchAnalysis = async () => {
        try {
          const response = await axios.get('http://localhost:5000/capacity/list');
          setMachineAnalysis(response.data.machineAnalysis);  // `data` is the response body
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

    fetchAnalysis();
  }, []);

  if (loading) return <p>Loading machine analysis...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!machineAnalysis) return <p className="no-data-text">No data available.</p>;

  return (
    <div className="capacity-analysis">
      <h2>Machine Capacity Analysis</h2>
      {Object.entries(machineAnalysis).map(([machineId, analysis]) => (
        <div key={machineId} className="machine-analysis">
          <h3>Machine ID: {machineId}</h3>
          <p>Utilization: {analysis.utilization.toFixed(1)}%</p>
          <p>Total Schedules: {analysis.schedules.length}</p>
          <p>Overlaps Detected: {analysis.overlaps.length}</p>
          
          {analysis.idlePeriods.length > 0 && (
            <div>
              <h4>Idle Periods</h4>
              {analysis.idlePeriods.map((period, index) => (
                <p key={index}>Idle from {new Date(period.start).toLocaleString()} to {new Date(period.end).toLocaleString()}</p>
              ))}
            </div>
          )}

          {analysis.recommendations.length > 0 && (
            <div>
              <h4>Recommendations</h4>
              {analysis.recommendations.map((rec, index) => (
                <p key={index}>{rec.description} ({rec.type})</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CapacityAnalysis;
