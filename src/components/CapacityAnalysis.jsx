import { useMemo } from 'react';
import './CapacityAnalysis.css';

const CapacityAnalysis = ({ schedules }) => {
  const analyzeCapacity = useMemo(() => {
    const machineAnalysis = {};

    // Group schedules by machine
    schedules.forEach(schedule => {
      if (!machineAnalysis[schedule.machine]) {
        machineAnalysis[schedule.machine] = {
          schedules: [],
          overlaps: [],
          utilization: 0,
          idlePeriods: [],
          recommendations: []
        };
      }
      machineAnalysis[schedule.machine].schedules.push(schedule);
    });

    // Analyze overlaps and utilization for each machine
    Object.keys(machineAnalysis).forEach(machine => {
      const machineSchedules = machineAnalysis[machine].schedules;
      
      // Sort schedules by start date
      machineSchedules.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      // Find overlaps and generate recommendations
      for (let i = 0; i < machineSchedules.length; i++) {
        for (let j = i + 1; j < machineSchedules.length; j++) {
          const schedule1 = machineSchedules[i];
          const schedule2 = machineSchedules[j];
          
          const start1 = new Date(schedule1.startDate);
          const end1 = new Date(schedule1.endDate);
          const start2 = new Date(schedule2.startDate);
          const end2 = new Date(schedule2.endDate);

          if (start2 < end1) {
            const overlap = {
              schedule1,
              schedule2,
              overlapStart: start2,
              overlapEnd: end1 < end2 ? end1 : end2
            };
            machineAnalysis[machine].overlaps.push(overlap);

            // Generate recommendations based on overlap
            if (!schedule1.isNonChangeable && !schedule2.isNonChangeable) {
              const recommendation = {
                type: 'reschedule',
                description: `Consider rescheduling Order ${schedule2.orderId} to avoid overlap with Order ${schedule1.orderId}`,
                requiresApproval: true
              };
              machineAnalysis[machine].recommendations.push(recommendation);
            } else if (schedule1.isNonChangeable && !schedule2.isNonChangeable) {
              const recommendation = {
                type: 'outsource',
                description: `Consider outsourcing Order ${schedule2.orderId} as it conflicts with non-changeable Order ${schedule1.orderId}`,
                requiresApproval: true
              };
              machineAnalysis[machine].recommendations.push(recommendation);
            }

            // Suggest extra shift if utilization is high
            if (machineAnalysis[machine].utilization > 80) {
              const recommendation = {
                type: 'extra_shift',
                description: `Consider adding extra shift for ${machine} due to high utilization`,
                requiresApproval: true
              };
              machineAnalysis[machine].recommendations.push(recommendation);
            }
          }
        }
      }

      // Find idle periods
      if (machineSchedules.length > 1) {
        for (let i = 0; i < machineSchedules.length - 1; i++) {
          const currentEnd = new Date(machineSchedules[i].endDate);
          const nextStart = new Date(machineSchedules[i + 1].startDate);
          const idleTime = nextStart - currentEnd;

          if (idleTime > 3600000) { // More than 1 hour idle
            machineAnalysis[machine].idlePeriods.push({
              start: currentEnd,
              end: nextStart,
              duration: idleTime
            });
          }
        }
      }

      // Calculate utilization
      if (machineSchedules.length > 0) {
        const totalTime = machineSchedules.reduce((total, schedule) => {
          return total + (new Date(schedule.endDate) - new Date(schedule.startDate));
        }, 0);
        
        const earliestStart = new Date(Math.min(...machineSchedules.map(s => new Date(s.startDate))));
        const latestEnd = new Date(Math.max(...machineSchedules.map(s => new Date(s.endDate))));
        const timeRange = latestEnd - earliestStart;
        
        machineAnalysis[machine].utilization = (totalTime / timeRange) * 100;
      }
    });

    return machineAnalysis;
  }, [schedules]);

  return (
    <div className="capacity-analysis">
      <h2>Machine Capacity Analysis</h2>
      {Object.entries(analyzeCapacity).map(([machine, analysis]) => (
        <div key={machine} className="machine-analysis">
          <h3>{machine}</h3>
          <div className="analysis-stats">
            <p>Utilization: {analysis.utilization.toFixed(1)}%</p>
            <p>Total Schedules: {analysis.schedules.length}</p>
            <p>Overlaps Detected: {analysis.overlaps.length}</p>
          </div>

          {analysis.idlePeriods.length > 0 && (
            <div className="idle-periods-section">
              <h4>Idle Capacity Periods</h4>
              {analysis.idlePeriods.map((period, index) => (
                <div key={index} className="idle-period-item">
                  <p>Idle Period: {period.start.toLocaleString()} - {period.end.toLocaleString()}</p>
                  <p>Duration: {Math.round(period.duration / 3600000)} hours</p>
                </div>
              ))}
            </div>
          )}

          {analysis.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h4>Recommendations</h4>
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <p>{rec.description}</p>
                  <p className="recommendation-type">{rec.type}</p>
                  {rec.requiresApproval && (
                    <p className="approval-required">Requires Manual Approval</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {analysis.overlaps.length > 0 && (
            <div className="overlaps-section">
              <h4>Schedule Conflicts</h4>
              {analysis.overlaps.map((overlap, index) => (
                <div key={index} className="overlap-item">
                  <p>Conflict between:</p>
                  <ul>
                    <li>
                      Order {overlap.schedule1.orderId} 
                      (Priority: {overlap.schedule1.priority})
                      {overlap.schedule1.isNonChangeable && ' (Non-Changeable)'}
                      <br />
                      {new Date(overlap.schedule1.startDate).toLocaleString()} - 
                      {new Date(overlap.schedule1.endDate).toLocaleString()}
                    </li>
                    <li>
                      Order {overlap.schedule2.orderId} 
                      (Priority: {overlap.schedule2.priority})
                      {overlap.schedule2.isNonChangeable && ' (Non-Changeable)'}
                      <br />
                      {new Date(overlap.schedule2.startDate).toLocaleString()} - 
                      {new Date(overlap.schedule2.endDate).toLocaleString()}
                    </li>
                  </ul>
                  <p className="overlap-period">
                    Overlap period: {new Date(overlap.overlapStart).toLocaleString()} - 
                    {new Date(overlap.overlapEnd).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CapacityAnalysis;