import { useState, useEffect } from 'react'
import ScheduleForm from './components/ScheduleForm'
import CapacityAnalysis from './components/CapacityAnalysis'
import './App.css'

function App() {
  const [schedules, setSchedules] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('schedules')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingSchedule, setEditingSchedule] = useState(null)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/schedules')
      if (!response.ok) throw new Error('Failed to fetch schedules')
      const data = await response.json()
      setSchedules(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSchedule = async (newSchedule) => {
    try {
      setError(null);
      const url = editingSchedule
        ? `http://localhost:5000/api/schedules/${editingSchedule._id}`
        : 'http://localhost:5000/api/schedules';
      const method = editingSchedule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save schedule');
      }

      const savedSchedule = await response.json();
      setSchedules(prev => 
        editingSchedule
          ? prev.map(s => s._id === editingSchedule._id ? savedSchedule : s)
          : [...prev, savedSchedule]
      );
      setShowForm(false);
      setEditingSchedule(null);
    } catch (err) {
      setError(err.message);
      alert('Error saving schedule: ' + err.message);
    }
  };
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Production Schedule Summary</h1>
        <p>Priority Re-Arranging Based on Machine Capacity Overlaps</p>
      </header>
      <main className="main-content">
        <section className="schedule-controls">
          <button className="control-btn" onClick={() => setShowForm(true)}>Add New Schedule</button>
        </section>
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'schedules' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedules')}
          >
            Schedule List
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            Capacity Analysis
          </button>
        </div>
        {activeTab === 'schedules' ? (
          <section className="schedule-list">
            {schedules.length === 0 ? (
              <div className="empty-state">
                <p>No production schedules available. Add a new schedule to begin.</p>
              </div>
            ) : (
              <div className="schedules-grid">
                {schedules.map(schedule => (
                  <div key={schedule.id} className="schedule-card">
                    <h3>Order: {schedule.orderId}</h3>
                    <p>Machine: {schedule.machine}</p>
                    <p>Priority: {schedule.priority}</p>
                    <p>Start: {new Date(schedule.startDate).toLocaleString()}</p>
                    <p>End: {new Date(schedule.endDate).toLocaleString()}</p>
                    <button 
                      className="reschedule-btn"
                      onClick={() => {
                        if (schedule.isNonChangeable) {
                          alert('This schedule cannot be modified as it is marked as non-changeable.');
                          return;
                        }
                        setShowForm(true);
                        setEditingSchedule(schedule);
                      }}
                    >
                      Reschedule
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <CapacityAnalysis schedules={schedules} />
        )}
      </main>
      {showForm && <ScheduleForm onClose={() => setShowForm(false)} onSubmit={handleAddSchedule} />}
    </div>
  )
}

export default App
