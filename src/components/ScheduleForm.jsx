import { useState, useEffect } from 'react';
import './ScheduleForm.css';

const ScheduleForm = ({ onClose, onSubmit, editingSchedule }) => {
  const [formData, setFormData] = useState({
    orderId: '',
    machine: '',
    priority: 1,
    startDate: '',
    endDate: '',
    isNonChangeable: false,
    requiresApproval: true,
    extraShift: false,
    outsourced: false
  });

  useEffect(() => {
    if (editingSchedule) {
      // Format dates for datetime-local input
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        orderId: editingSchedule.orderId,
        machine: editingSchedule.machine,
        priority: editingSchedule.priority,
        startDate: formatDate(editingSchedule.startDate),
        endDate: formatDate(editingSchedule.endDate),
        isNonChangeable: editingSchedule.isNonChangeable,
        requiresApproval: editingSchedule.requiresApproval,
        extraShift: editingSchedule.extraShift,
        outsourced: editingSchedule.outsourced
      });
    }
  }, [editingSchedule]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end <= start) {
      alert('End date must be after start date');
      return;
    }
    
    // Format the data for submission
    const scheduleData = {
      ...formData,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      priority: parseInt(formData.priority)
    };
    
    onSubmit(scheduleData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingSchedule ? 'Reschedule Order' : 'Add New Schedule'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="orderId">Order ID</label>
            <input
              type="text"
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              required
              disabled={editingSchedule}
            />
          </div>
          <div className="form-group">
            <label htmlFor="machine">Machine</label>
            <select
              id="machine"
              name="machine"
              value={formData.machine}
              onChange={handleChange}
              required
            >
              <option value="">Select Machine</option>
              <option value="machine1">Machine 1</option>
              <option value="machine2">Machine 2</option>
              <option value="machine3">Machine 3</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority Level</label>
            <input
              type="number"
              id="priority"
              name="priority"
              min="1"
              max="5"
              value={formData.priority}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isNonChangeable"
                checked={formData.isNonChangeable}
                onChange={handleChange}
                disabled={editingSchedule}
              />
              Non-Changeable Schedule
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="requiresApproval"
                checked={formData.requiresApproval}
                onChange={handleChange}
              />
              Requires Manual Approval
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="extraShift"
                checked={formData.extraShift}
                onChange={handleChange}
              />
              Extra Shift Required
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="outsourced"
                checked={formData.outsourced}
                onChange={handleChange}
              />
              Outsourced Production
            </label>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{editingSchedule ? 'Update Schedule' : 'Add Schedule'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;