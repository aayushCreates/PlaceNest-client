import React, { useEffect, useState } from "react";
import { FiUser, FiBriefcase, FiFileText, FiTrendingUp } from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import type { Job } from "../types/job.types";

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recentJobs: Job[] = [...response.data.data]
      .sort((a,b)=> 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setJobs(recentJobs);
    } catch (err) {
      toast.error("Error in fetching the jobs");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setStats([
        {
          title: "Applications Sent",
          val: user.totalApplications || 0,
          icon: <FiFileText className="text-yellow-500 h-8 w-8" />,
          boxCss:
            "flex items-center gap-5 bg-white border border-yellow-500/40 rounded-md p-4 shadow-xs",
          titleCss: "text-lg font-semibold text-yellow-600",
          valCss: "text-yellow-500",
        },
        {
          title: "Available Job",
          val: jobs.length,
          icon: <FiBriefcase className="text-blue-600 h-8 w-8" />,
          boxCss:
            "flex items-center gap-5 bg-white border border-blue-500/40 rounded-md p-4 shadow-xs",
          titleCss: "text-lg font-semibold text-blue-600",
          valCss: "text-blue-500",
        },
        {
          title: "Skills Added",
          val: user.skills?.length || 0,
          icon: <FiUser className="text-gray-600 h-8 w-8" />,
          boxCss:
            "flex items-center gap-5 bg-white border border-gray-500/40 rounded-md p-4 shadow-xs",
          titleCss: "text-lg font-semibold",
          valCss: "text-gray-600",
        },
        {
          title: "Interview Calls",
          val: user.interviewCalls || 0,
          icon: <FiTrendingUp className="text-green-500 h-8 w-8" />,
          boxCss:
            "flex items-center gap-5 bg-white border border-green-500/40 rounded-md p-4 shadow-xs",
          titleCss: "text-lg font-semibold text-green-600",
          valCss: "text-green-500",
        },
      ]);
      fetchJobs();
    }
  }, [user, jobs.length]);

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-600">Here's your job search overview</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={stat.boxCss}>
              {stat.icon}
              <div className="flex justify-between items-center w-full">
                <h2 className={stat.titleCss}>{stat.title}</h2>
                <p className={`font-semibold text-xl ${stat.valCss}`}>
                  {stat.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 📄 Recent Applications */}
          <section className="col-span-2 bg-white border border-black/10 rounded-md p-6 shadow-xs">
            <h3 className="text-lg font-medium mb-4">Recent Applications</h3>

            <div className="flex flex-col gap-3">
              {isLoadingJobs ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm mt-2">
                    Loading recent applications...
                  </p>
                </div>
              ) : jobs.length === 0 ? (
                <p className="text-gray-400 text-sm">No applications found.</p>
              ) : (
                jobs.slice(0,5).map((job, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-black/10 py-3 px-4 rounded-md bg-gray-50/50"
                  >
                    <div>
                      <strong>{job.title}</strong>
                      <p className="text-sm text-gray-600">
                        {job.company?.name} • {job.createdAt}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${
                        job.status === "ACTIVE"
                          ? "border-green-500/20 bg-green-500/10 text-green-500"
                          : job.status === "CLOSED"
                          ? "border-red-500/20 bg-red-500/10 text-red-500"
                          : "border-gray-500/20 bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              className="mt-4 border border-blue-500/20 text-blue-600 py-2 px-4 rounded-md text-sm hover:bg-blue-50 hover:cursor-pointer"
              onClick={() => navigate("/student/jobs")}
            >
              View All Applications
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
