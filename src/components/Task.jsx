import React, { useState } from 'react';
import TaskPopup from './TaskPopup';
import EditButton from './EditButton';
import DeleteTaskButton from './DeleteTaskButton';
import axios from 'axios';

const Task = ({ taskName, task, dueDate, description, onDelete, onStatusChange, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed || false);

  const getPriorityColor = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) return 'bg-red-500';
    if (diffInDays <= 3) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const handleCheckboxChange = async (e) => {
    e.stopPropagation();
    const newStatus = e.target.checked;
    setIsCompleted(newStatus);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/tasks/updateTask/${task.id}`,
        { completed: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Task status updated successfully");
      onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <div
        className="w-full bg-neutral-200 shadow-md p-4 rounded flex justify-between items-center cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex gap-5 items-center">
          <div
            className={`w-4 h-4 flex-none rounded-full ${getPriorityColor()}`}
            title={`Due in ${Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days`}
          ></div>
          <input
            type="checkbox"
            className="w-6 h-6 flex-none"
            checked={isCompleted}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleCheckboxChange(e)}
          />
          <p className={`${isCompleted ? 'line-through text-gray-500' : ''} w-32 md:w-72 lg:w-full text-start break-words`}>
            {taskName}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <EditButton task={task} onUpdate={onUpdate} onClick={(e) => e.stopPropagation()} />
          <DeleteTaskButton task={task} onDelete={onDelete} onClick={(e) => e.stopPropagation()} />
        </div>
      </div>

      {isModalOpen && (
        <TaskPopup
          taskName={taskName}
          dueDate={dueDate}
          description={description}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Task;
