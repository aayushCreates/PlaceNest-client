import React, { useEffect, useState, useMemo } from "react";
import { 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiFileText, 
  FiBriefcase, 
  FiCheckCircle, 
  FiArrowRight, 
  FiFilter, 
  FiDollarSign,
  FiUser
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import type { Job } from "../types/job.types";
import { useAuth } from "../context/AuthContext";

const StudentJobs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [initialJobData, setInitialJobData] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedType, setSelectedType] = useState("All Types");

  const appliedJobIds = useMemo(() => {
    return new Set(user?.applications?.map((app: any) => app.jobId) || []);
  }, [user?.applications]);

  const branchData = ["All Branches", "CSE", "CY", "IT", "ME", "ECE", "EIC", "EE", "CE"];
  const jobTypes = ["All Types", "Internship", "PartTime", "FullTime", "Contract"];

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data.data)) {
        const sortedJobs = [...response.data.data].sort((a, b) => 
          new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        );
        setInitialJobData(sortedJobs);
        setJobs(sortedJobs);
      }
    } catch (err) {
      toast.error("Error in fetching jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return initialJobData.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = selectedBranch === "All Branches" || job.branch === selectedBranch;
      const matchesType = selectedType === "All Types" || job.type === selectedType;
      return matchesSearch && matchesBranch && matchesType;
    });
  }, [searchQuery, selectedBranch, selectedType, initialJobData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Campus Opportunities</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Discover and apply for jobs that match your career goals.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
              <FiFilter />
            </div>
            <h3 className="font-bold text-slate-800">Filter Opportunities</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 lg:col-span-7 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search by role or company..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-3 lg:col-span-2.5">
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-xs text-slate-600 cursor-pointer appearance-none"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {branchData.map((b, idx) => (
                  <option key={idx} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 lg:col-span-2.5">
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-xs text-slate-600 cursor-pointer appearance-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {jobTypes.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium mt-4">Finding the best roles for you...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 text-4xl">
                <FiSearch />
              </div>
              <h2 className="text-xl font-bold text-slate-900">No jobs found</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">Try adjusting your search or filters to find more opportunities.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedBranch("All Branches"); setSelectedType("All Types");}}
                className="mt-6 text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white p-6 md:p-8 rounded-3xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
              >
                {/* Applied Ribbon */}
                {appliedJobIds.has(job.id) && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-tighter py-1 px-8 translate-x-[30%] translate-y-[50%] rotate-45 shadow-sm">
                      Applied
                    </div>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start md:items-center gap-5">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all text-xl md:text-2xl shrink-0 uppercase">
                      {job.company?.name?.charAt(0) || "J"}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {job.title}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all 
                          ${job.type === 'Internship' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                            job.type === 'FullTime' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {job.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><FiBriefcase className="text-slate-400" /> {job.company?.name}</span>
                        <span className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {job.location}</span>
                        <span className="flex items-center gap-1.5 text-blue-600 font-bold"><FiDollarSign className="text-blue-400" /> ₹{job.salary}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 lg:gap-2 shrink-0">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><FiClock className="text-lg" /> Posted {job.createdAt ? formatDate(job.createdAt as string) : 'Recent'}</span>
                      <span className="flex items-center gap-1.5 text-rose-500/70"><FiFileText className="text-lg" /> Deadline: {job.deadline}</span>
                    </div>
                    <button
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-100 transition-all group/btn flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => navigate(`/student/job/${job.id}`)}
                    >
                      Explore Role <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50">
                   <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-1 italic">
                     "{job.description}"
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

export default StudentJobs;
