import React, { useEffect, useState, useMemo } from "react";
import { 
  FiEye, 
  FiMapPin, 
  FiClock, 
  FiFileText, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock as FiPending,
  FiSearch,
  FiUser,
  FiBriefcase,
  FiFilter,
  FiChevronDown
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import type { Application } from "../types/application.types";
import { useAuth } from "../context/AuthContext";
import { FaTrophy } from "react-icons/fa";

const tabs = [
  { label: "All", status: "All" },
  { label: "Pending", status: "PENDING" },
  { label: "Shortlisted", status: "SHORTLISTED" },
  { label: "Rejected", status: "REJECTED" },
  { label: "Selected", status: "SELECTED" },
];

const StudentApplications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [currTab, setCurrTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const token = localStorage.getItem("token");

  const statusConfig: Record<string, { color: string, icon: any, ring: string, light: string }> = {
    SHORTLISTED: { color: "bg-blue-50 text-blue-700 border-blue-100", light: "text-blue-600", ring: "ring-blue-50", icon: <FiCheckCircle /> },
    PENDING: { color: "bg-amber-50 text-amber-700 border-amber-100", light: "text-amber-600", ring: "ring-amber-50", icon: <FiPending /> },
    REJECTED: { color: "bg-rose-50 text-rose-700 border-rose-100", light: "text-rose-600", ring: "ring-rose-50", icon: <FiXCircle /> },
    SELECTED: { color: "bg-emerald-50 text-emerald-700 border-emerald-100", light: "text-emerald-600", ring: "ring-emerald-50", icon: <FaTrophy /> },
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/application`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(response.data.data || []);
    } catch (err) {
      toast.error("Error fetching applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      const matchesTab = currTab === "All" || a.status === currTab.toUpperCase();
      const matchesSearch = a.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           a.job?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [currTab, searchQuery, applications]);

  const stats = useMemo(() => [
    { label: "Total Applications", val: applications.length, color: "slate", icon: <FiFileText /> },
    { label: "Selected Applications", val: applications.filter(a => a.status === "SELECTED").length, color: "emerald", icon: <FaTrophy /> },
    { label: "Shortlisted Applications", val: applications.filter(a => a.status === "SHORTLISTED").length, color: "blue", icon: <FiCheckCircle /> },
    { label: "Rejected Applications", val: applications.filter(a => a.status === "REJECTED").length, color: "rose", icon: <FiXCircle /> },
  ], [applications]);

  // Find active tab info
  const activeTabObj = tabs.find(t => t.label === currTab);
  const activeConfig = statusConfig[activeTabObj?.status || ""] || { icon: <FiFilter />, color: "bg-white text-slate-700 border-slate-100", ring: "ring-slate-50" };

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 truncate">My Applications</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Track and manage your placement journey progress.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm overflow-hidden relative group">
               <div className={`absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform
                  ${stat.color === 'slate' ? 'bg-slate-900' : ''}
                  ${stat.color === 'emerald' ? 'bg-emerald-600' : ''}
                  ${stat.color === 'blue' ? 'bg-blue-600' : ''}
                  ${stat.color === 'rose' ? 'bg-rose-600' : ''}
               `}></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shrink-0
                    ${stat.color === 'slate' ? 'bg-slate-50 text-slate-600' : ''}
                    ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                    ${stat.color === 'rose' ? 'bg-rose-50 text-rose-600' : ''}
                  `}>
                    {stat.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest truncate">{stat.label}</p>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">{stat.val}</h3>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm mb-10">
          <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full xl:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative w-full xl:w-72">
              <button 
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all cursor-pointer shadow-sm
                  ${currTab === "All" 
                    ? "bg-white text-slate-700 border-slate-100 hover:border-slate-300" 
                    : `${activeConfig.color} border-transparent shadow-md ring-4 ${activeConfig.ring} ring-offset-0`}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{currTab === "All" ? <FiFilter /> : activeConfig.icon}</span>
                  <span>{currTab} Applications</span>
                </div>
                <FiChevronDown className={`transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} />
              </button>

              {isStatusOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsStatusOpen(false)}></div>
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-2xl shadow-2xl z-30 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {tabs.map((tab) => {
                      const isActive = currTab === tab.label;
                      const count = tab.status === "All" ? applications.length : applications.filter(a => a.status === tab.status).length;
                      const config = statusConfig[tab.status] || { icon: <FiFilter /> };
                      
                      return (
                        <button
                          key={tab.label}
                          onClick={() => {
                            setCurrTab(tab.label);
                            setIsStatusOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-sm font-bold
                            ${isActive ? 'text-blue-600 bg-blue-50/30' : 'text-slate-600'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-base ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                              {tab.status === 'All' ? <FiFilter /> : config.icon}
                            </span>
                            {tab.label}
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Application List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium mt-4">Syncing your journey...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 text-4xl">
                <FiSearch />
              </div>
              <h2 className="text-xl font-bold text-slate-900">No applications found</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">Try adjusting your search or filters to find your applications.</p>
              {(currTab !== "All" || searchQuery !== "") && (
                <button 
                  onClick={() => {setCurrTab("All"); setSearchQuery("");}}
                  className="mt-6 text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className="group bg-white p-6 md:p-8 rounded-3xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start md:items-center gap-5">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all text-xl md:text-2xl shrink-0 uppercase">
                      {app.job?.company?.name?.charAt(0) || "J"}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {app.job?.title}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 transition-all ${statusConfig[app.status]?.color || 'bg-slate-50'}`}>
                          {statusConfig[app.status]?.icon}
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><FiBriefcase className="text-slate-400" /> {app.job?.company?.name}</span>
                        <span className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {app.job?.location}</span>
                        <span className="flex items-center gap-1.5"><FiClock className="text-slate-400" /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center lg:items-end shrink-0">
                    <button
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-100 transition-all group/btn flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => navigate(`/student/job/${app.job?.id || ""}`)}
                    >
                      <FiEye /> View Details
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50">
                   <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 italic">
                     "{app.job?.description}"
                   </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentApplications;
