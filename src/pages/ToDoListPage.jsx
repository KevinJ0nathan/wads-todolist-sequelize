import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

import Navbar from "../components/Navbar";
import ProgressTracker from "../components/ProgressTracker";
import AddTaskButton from "../components/AddTaskButton";
import SearchBar from "../components/SearchBar";
import UserContext from "../context/UserContext";
import Task from "../components/Task";
import "./ToDoListPage.css";

const ToDoListPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const handleNameUpdate = (newName) => {
    setName(newName);
  };

  // Decode token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setName(decoded.name);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []); 
  
  // Fetch tasks from backend using userId from the decoded token
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const decoded = jwtDecode(token); 
        const userId = decoded.id; 

        const response = await axios.get(`http://localhost:3000/api/tasks/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(response.data);
        updateProgress(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [user, navigate]);

  useEffect(() => {
    // Add a class to body when this component mounts
    document.body.classList.add("todo-page-body");

    // Remove class when component unmounts (cleanup)
    return () => {
      document.body.classList.remove("todo-page-body");
    };
  }, []);

  const updateProgress = (taskList) => {
    const completedCount = taskList.filter((task) => task.completed).length;
    const progressValue = taskList.length
      ? (completedCount / taskList.length) * 100
      : 0;
    setProgress(parseFloat(progressValue.toFixed(2)));
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: newStatus } : task
    );
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const handleTaskAdded = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const handleTaskUpdated = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
  };
  
  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/tasks/deleteTask/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      updateProgress(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!task || !task.title) return false; 
    const lowerTitle = task.title.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase().trim();
    const matchesSearchQuery =
      lowerTitle.includes(` ${lowerQuery}`) ||
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.endsWith(lowerQuery);

    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = dueDate && !task.completed && dueDate < new Date();

    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed) ||
      (filter === "overdue" && isOverdue);

    return matchesSearchQuery && matchesFilter;
  });

  return (
    <UserContext.Provider value={user}>
      <div className="w-screen flex justify-center gap-4">
        <Navbar onFilterChange={handleFilterChange} onNameUpdate={handleNameUpdate} />
        <div className="w-15/16 max-w-[700px] mt-30 flex flex-col gap-3">
          <h1 className="font-medium text-4xl text-start">{name}'s To Dos</h1>
          <ProgressTracker progress={progress} />
          <div className="flex justify-between items-center">
            <SearchBar onSearch={setSearchQuery} />
            <AddTaskButton onTaskAdded={handleTaskAdded} />
          </div>
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <Task
                key={task.id}
                taskName={task.title}
                dueDate={
                  task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"
                }
                description={task.description}
                task={task}
                onDelete={() => handleDelete(task.id)}
                onStatusChange={handleStatusChange}
                onUpdate={handleTaskUpdated}
              />
            ))
          )}
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default ToDoListPage;
