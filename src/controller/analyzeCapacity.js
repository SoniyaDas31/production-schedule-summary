

const analyzeMachineCapacity = (schedules) => {
    const machineAnalysis = {};
  
    // Group schedules by machine
    schedules.forEach(schedule => {
      if (!machineAnalysis[schedule.machine._id]) {
        machineAnalysis[schedule.machine._id] = {
          schedules: [],
          overlaps: [],
          utilization: 0,
          idlePeriods: [],
          recommendations: []
        };
      }
      machineAnalysis[schedule.machine._id].schedules.push(schedule);
    });
  
    // Analyze overlaps, idle periods, and utilization for each machine
    Object.keys(machineAnalysis).forEach(machineId => {
      const machineSchedules = machineAnalysis[machineId].schedules;
  
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
  
          // Check if schedules overlap
          if (start2 < end1) {
            const overlap = {
              schedule1,
              schedule2,
              overlapStart: start2,
              overlapEnd: end1 < end2 ? end1 : end2
            };
            machineAnalysis[machineId].overlaps.push(overlap);
  
            // Generate recommendations based on overlap
            if (!schedule1.isNonChangeable && !schedule2.isNonChangeable) {
              machineAnalysis[machineId].recommendations.push({
                type: 'reschedule',
                description: `Consider rescheduling Order ${schedule2._id} to avoid overlap with Order ${schedule1._id}`,
                // description: `Consider rescheduling Order ${schedule2.orderId} to avoid overlap with Order ${schedule1.orderId}`,

                requiresApproval: true
              });
            } else if (schedule1.isNonChangeable && !schedule2.isNonChangeable) {
              machineAnalysis[machineId].recommendations.push({
                type: 'outsource',
                description: `Consider outsourcing Order ${schedule2._id} due to conflict with non-changeable Order ${schedule1._id}`,
                requiresApproval: true
              });
              //my code
            }
            else  {
              machineAnalysis[machineId].recommendations.push({
                type: 'Manager Approval',
                description: `Consider getting Manger approval for conflict between non-changeable Order ${schedule2._id} and order ${schedule1._id}`,
                requiresApproval: true
              });
            }
//till here

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
            machineAnalysis[machineId].idlePeriods.push({
              start: currentEnd,
              end: nextStart,
              duration: idleTime
            });
          }
        }
      }
  
      // Calculate utilization
      const totalTime = machineSchedules.reduce((total, schedule) => {
        return total + (new Date(schedule.endDate) - new Date(schedule.startDate));
      }, 0);
  
      const earliestStart = new Date(Math.min(...machineSchedules.map(s => new Date(s.startDate))));
      const latestEnd = new Date(Math.max(...machineSchedules.map(s => new Date(s.endDate))));
      const timeRange = latestEnd - earliestStart;
  
      machineAnalysis[machineId].utilization = (totalTime / timeRange) * 100;
    });
  
    return machineAnalysis;
  };
  
  module.exports = analyzeMachineCapacity;
  