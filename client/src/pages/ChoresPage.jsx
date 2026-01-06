import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ChoresPage = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chores, setChores] = useState(null);

  // Fetch chores from backend
  const fetchChores = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(backendUrl + '/api/chores');

      if (response.data.success) {
        setChores(response.data.chores);
      } else {
        toast.error(response.data.message || "Could not fetch chores");
        navigate('/my-room');
      }
    } catch (error) {
      toast.error("Error fetching chores");
      navigate('/my-room');
    } finally {
      setLoading(false);
    }
  };

  // Mark a chore as done
  const markDone = async (choreKey) => {
    try {
      const response = await axios.post(backendUrl + '/api/chores/done', { choreKey });

      if (response.data.success) {
        const updatedCompleted = {};
        for (let key in chores.completed) {
          updatedCompleted[key] = key === choreKey ? true : chores.completed[key];
        }

        setChores({
          assignments: chores.assignments,
          completed: updatedCompleted
        });

        toast.success("Chore marked done!");
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Failed to mark chore done");
    }
  };

  useEffect(() => {
    fetchChores();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#08101C] text-white">Loading...</div>;
  if (!chores) return null;

  // Mapping keys names
  const choreNames = {
    cooking: "Cooking",
    washingDishes: "Washing Dishes",
    cleaningRooms: "Cleaning Rooms",
    sweeping: "Sweeping",
    dustingFurniture: "Dusting Furniture",
    shopping: "Shopping"
  };

  // Current date
  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const dateString = today.toLocaleDateString(undefined, options);

  return (
    <div className="min-h-screen bg-[#08101C] pt-20">
      <Navbar />

      <div className="container mx-auto px-4 py-6">

        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/my-room')} 
            className="p-2 bg-slate-900 hover:bg-purple-900/50 text-purple-400 rounded-full transition-colors shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-purple-400">Room Chores</h1>
        </div>
        <p className="text-slate-400 mb-6">{dateString}</p>

        <div className="flex flex-col gap-4">
          {Object.keys(chores.assignments).map((key) => {
            const assignedUser = chores.assignments[key];
            const done = chores.completed[key];
            const isMine = assignedUser._id === userData._id;

            return (
              <div key={key} className={
                done
                  ? "p-5 bg-purple-900/30 border border-purple-700 rounded-2xl shadow-sm"
                  : "p-5 bg-slate-900 border border-slate-700 rounded-2xl shadow-sm"
              }>
                <div>
                  <span className="text-lg font-semibold text-indigo-400">{choreNames[key]}</span>
                  <p className="text-sm text-slate-300 mt-1">Assigned to: <span className="text-white font-medium">{assignedUser.name}</span></p>
                  {done && <span className="text-green-500 font-bold mt-1">Done</span>}
                </div>

                {isMine && !done && (
                  <button
                    onClick={() => markDone(key)}
                    className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            );
          })}

          {Object.keys(chores.assignments).length === 0 && (
            <p className="text-center text-slate-400 font-medium mt-6">No chores assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoresPage;

//implemented by Nusayba