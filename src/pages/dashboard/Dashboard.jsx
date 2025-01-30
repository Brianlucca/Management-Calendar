import React from "react";
import Calendar from "../../components/calendar/Calendar";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-center">Management Calendar</h1>
      </header>
      <main className="p-4">
        <Calendar />
      </main>
    </div>
  );
};

export default Dashboard;