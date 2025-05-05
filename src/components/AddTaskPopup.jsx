import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AddTaskPopup = ({ onClose, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/tasks/createTask',
        {
          title,
          description,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onTaskAdded) {
        onTaskAdded(response.data.task); 
      }

      onClose();
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to create task';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center text-start backdrop-blur-sm bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-15/16 max-w-[800px] relative">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-black">Add a Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              onChange={(e) => setTitle(e.target.value.toUpperCase())}
              value={title}
              className="border p-2 rounded w-full"
              placeholder="Enter title"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="border p-2 rounded w-full"
              placeholder="Enter task description"
              required
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              id="dueDate"
              onChange={(e) => setDueDate(e.target.value)}
              value={dueDate}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPopup;
