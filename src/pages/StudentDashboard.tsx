import React, { useEffect, useState, useMemo } from "react";
import { 
  FiUser, 
  FiBriefcase, 
  FiFileText, 
  FiTrendingUp, 
  FiClock, 
  FiZap, 
  FiSearch, 
  FiEdit3, 
  FiArrowRight, 
  FiCheckCircle, 
  FiXCircle, 
  FiMoreHorizontal 
} from "react-icons/fi";
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
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState<boolean>(false);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data.data)) {
        const recentJobs: Job[] = [...response.data.data]
        .sort((a,b)=> 
          new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        )

        setJobs(recentJobs);
      } else {
        setJobs([]);
      }
    } catch (err) {
      toast.error("Error in fetching the jobs");
    }
  };

  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/application`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
      fetchApplications();
    }
  }, [user?.id]);

  const stats = useMemo(() => [
    {
      title: "Applications Sent",
      val: applications.length,
      icon: <FiFileText />,
      color: "blue",
    },
    {
      title: "Available Jobs",
      val: jobs.length,
      icon: <FiBriefcase />,
      color: "indigo",
    },
    {
      title: "Shortlisted",
      val: applications.filter(a => a.status === "SHORTLISTED").length,
      icon: <FiCheckCircle />,
      color: "emerald",
    },
    {
      title: "Active Drives",
      val: applications.filter(a => a.status === "PENDING").length,
      icon: <FiZap />,
      color: "amber",
    },
  ], [applications, jobs.length]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [applications]);

  const latestJobs = useMemo(() => {
    return jobs.slice(0, 4);
  }, [jobs]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SELECTED":
      case "SHORTLISTED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="flex bg-gray-50/50 font-sans min-h-screen text-slate-900">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Here's your job search overview for today.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-xs md:text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider text-right">Placement Season 2026</span>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="p-2.5 md:p-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
            >
              <FiUser className="text-lg md:text-xl text-slate-600" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
               <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-110
                  ${stat.color === 'blue' ? 'bg-blue-600' : ''}
                  ${stat.color === 'indigo' ? 'bg-indigo-600' : ''}
                  ${stat.color === 'emerald' ? 'bg-emerald-600' : ''}
                  ${stat.color === 'amber' ? 'bg-amber-600' : ''}
               `}></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl transition-transform group-hover:scale-110 shadow-sm shrink-0
                    ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                    ${stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : ''}
                    ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
                  `}>
                    {stat.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest truncate">{stat.title}</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900">{stat.val}</h3>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Recent Applications - 2 Columns */}
          <section className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm md:text-base">
                  <FiFileText />
                </div>
                <h3 className="text-lg md:text-xl font-bold">Recent Applications</h3>
              </div>
              <button 
                onClick={() => navigate("/student/applications")}
                className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
              >
                View all <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl lg:rounded-[2.5rem] p-5 md:p-8 shadow-sm">
              <div className="space-y-4">
                {isLoadingApps ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-xs md:text-sm font-medium mt-4">Syncing your applications...</p>
                  </div>
                ) : recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <FiSearch className="text-2xl md:text-3xl" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm md:text-base">No applications yet.</p>
                    <p className="text-slate-400 text-xs md:text-sm mt-1">Explore campus jobs and start applying!</p>
                  </div>
                ) : (
                  recentApplications.map((app, index) => (
                    <div
                      key={index}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 border border-slate-50 rounded-2xl hover:border-blue-100 hover:bg-blue-50/10 transition-all gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors uppercase text-sm md:text-base shrink-0">
                          {app.job?.company?.name?.charAt(0) || "J"}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-900 text-base md:text-lg leading-tight group-hover:text-blue-600 transition-colors truncate">
                            {app.job?.title}
                          </h4>
                          <p className="text-xs md:text-sm text-slate-500 font-medium truncate">
                            {app.job?.company?.name} • {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                         <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(app.status)}`}>
                            {app.status}
                         </span>
                         <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors cursor-pointer">
                            <FiMoreHorizontal />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Quick Actions & Recommendations - 1 Column */}
          <section className="space-y-6 md:space-y-8">
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-bold flex items-center gap-2 px-1">
                <FiZap className="text-amber-500" /> Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => navigate('/student/resume-review')}
                  className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all group shadow-lg shadow-slate-200 cursor-pointer overflow-hidden"
                >
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 shrink-0">
                      <FiEdit3 />
                   </div>
                   <div className="text-left overflow-hidden">
                      <p className="font-bold text-xs md:text-sm">Resume Assistant</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Get AI feedback on your resume</p>
                   </div>
                   <FiArrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
                <button 
                  onClick={() => navigate('/student/jobs')}
                  className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all group shadow-sm cursor-pointer overflow-hidden"
                >
                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <FiSearch />
                   </div>
                   <div className="text-left overflow-hidden">
                      <p className="font-bold text-xs md:text-sm text-slate-900">Explore Jobs</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Find new opportunities today</p>
                   </div>
                   <FiArrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600 shrink-0" />
                </button>
              </div>
            </div>

            {/* Latest Jobs Small Feed */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-bold flex items-center gap-2 px-1">
                <FiClock className="text-indigo-500" /> Latest Jobs
              </h3>
              <div className="bg-white border border-slate-100 rounded-3xl lg:rounded-[2rem] p-5 md:p-6 shadow-sm space-y-4">
                 {latestJobs.length === 0 ? (
                    <p className="text-[10px] md:text-xs text-slate-400 text-center py-4">No new jobs posted yet.</p>
                 ) : (
                    latestJobs.map((job, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 cursor-pointer group overflow-hidden" onClick={() => navigate(`/student/jobs/${job.id}`)}>
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0 text-xs md:text-sm">
                            {job.company?.name?.charAt(0)}
                         </div>
                         <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 text-xs md:text-sm truncate">{job.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">{job.company?.name}</p>
                         </div>
                         <div className="ml-auto shrink-0">
                            <FiArrowRight className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                         </div>
                      </div>
                    ))
                 )}
                 <button 
                   onClick={() => navigate('/student/jobs')}
                   className="w-full py-3 bg-slate-50 text-slate-600 text-[10px] md:text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer mt-2"
                 >
                    Search All Jobs
                 </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
