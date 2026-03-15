import {
  FiClock,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiX,
  FiPlus,
  FiTrendingUp,
  FiSearch,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiArrowRight,
  FiDownload
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useEffect, useState, useMemo } from "react";
import type { Job } from "../types/job.types";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: string }) => {
  const styles: Record<string, string> = {
    default: "bg-slate-50 text-slate-600 border-slate-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
};

export default function ManageJobs() {
  const navigate = useNavigate();
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [totalActiveJobs, setTotalActiveJobs] = useState<number>(0);
  const [totalPendingJobs, setTotalPendingJobs] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const stats = useMemo(() => [
    { label: "Total Postings", val: companyJobs.length, icon: <FiBriefcase />, color: "slate" },
    { label: "Active Roles", val: totalActiveJobs, icon: <FiTrendingUp />, color: "blue" },
    { label: "Drafts", val: totalPendingJobs, icon: <FiFileText />, color: "amber" },
  ], [companyJobs.length, totalActiveJobs, totalPendingJobs]);

  const fetchJobs = async () => {
    if (!user?.id || !token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/company/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const jobs = response.data.data;
      setCompanyJobs(jobs);

      let pending = 0;
      let active = 0;
      jobs.forEach((j: any) => {
        if (j.status === "ACTIVE") active++;
        else if (j.status === "DRAFT") pending++;
      });
      setTotalActiveJobs(active);
      setTotalPendingJobs(pending);
    } catch {
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchJobs();
  }, [user?.id]);

  const filteredJobs = useMemo(() => {
    return companyJobs.filter(j => 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, companyJobs]);

  const handleOpenModal = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
    setJobApplications((job as any).applications || []);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
    setJobApplications([]);
  };

  const handleAcceptReject = async (appId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_API_URL}/application/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Application ${status.toLowerCase()}`);
      setJobApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
      setCompanyJobs(prevJobs => 
        prevJobs.map(j => ({
          ...j,
          applications: (j as any).applications?.map((a: any) => 
            a.id === appId ? { ...a, status } : a
          )
        }))
      );
    } catch {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
              Manage Job Postings
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Review applicant lists and control your active hiring drives.</p>
          </div>
          {/* <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/company/post-job")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer"
            >
              <FiPlus className="text-lg" /> Create New Role
            </button>
          </div> */}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm overflow-hidden relative group">
               <div className={`absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform
                  ${stat.color === 'slate' ? 'bg-slate-900' : ''}
                  ${stat.color === 'blue' ? 'bg-blue-600' : ''}
                  ${stat.color === 'amber' ? 'bg-amber-600' : ''}
               `}></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shrink-0
                    ${stat.color === 'slate' ? 'bg-slate-50 text-slate-600' : ''}
                    ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                    ${stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
                  `}>
                    {stat.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest truncate">{stat.label}</p>
                    <h3 className="text-xl md:text-3xl font-black text-slate-900">{stat.val}</h3>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm mb-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search by job title or location..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm text-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium mt-4">Organizing your postings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 text-4xl">
                <FiBriefcase />
              </div>
              <h2 className="text-xl font-bold text-slate-900">No jobs found</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">We couldn't find any postings matching your criteria.</p>
            </div>
          ) : (
            filteredJobs.map((j) => (
              <div key={j.id} className="group bg-white p-6 md:p-8 rounded-3xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300 overflow-hidden relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start md:items-center gap-5 overflow-hidden">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all shrink-0">
                      <FiBriefcase />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {j.title}
                        </h2>
                        <Badge variant={j.status === 'ACTIVE' ? 'green' : 'amber'}>{j.status}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {j.location}</span>
                        <span className="flex items-center gap-1.5"><FiClock className="text-slate-400" /> Type: {j.type}</span>
                        <span className="flex items-center gap-1.5 font-bold text-emerald-600"><FiDollarSign className="text-emerald-400" /> ₹{j.salary}</span>
                        <span className="flex items-center gap-1.5"><FiCalendar className="text-slate-400" /> Posted: {new Date(j.createdAt as string).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleOpenModal(j)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-100 transition-all group/btn cursor-pointer whitespace-nowrap"
                    >
                      <FiUsers /> View Applicants <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <p className="text-slate-500 text-sm leading-relaxed line-clamp-1 italic max-w-2xl">
                     "{j.description}"
                   </p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500/70 bg-rose-50/50 px-3 py-1 rounded-full border border-rose-100/50 w-fit">
                      <FiClock /> Ends {new Date(j.deadline as string).toLocaleDateString()}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal for Applications */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer z-10"
            >
              <FiX size={20} />
            </button>

            <div className="p-8 lg:p-10">
              <div className="mb-8 pr-12">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">Applicants for {selectedJob?.title}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Review student profiles and update their hiring status.</p>
              </div>

              {jobApplications.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                   <FiUsers className="text-4xl text-slate-300 mx-auto mb-4" />
                   <p className="text-slate-500 font-bold">No applications received yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {jobApplications.map((a) => (
                    <div key={a.id} className="group p-5 border border-slate-100 rounded-3xl hover:border-blue-100 hover:bg-blue-50/10 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl shadow-inner shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {a.student?.name?.charAt(0) || "S"}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 text-lg truncate">{a.student?.name || "N/A"}</p>
                            <p className="text-xs text-slate-500 font-medium truncate">{a.student?.email || "N/A"}</p>
                            <div className="mt-2 flex items-center gap-2">
                               <Badge variant={a.status === 'ACCEPTED' ? 'green' : a.status === 'REJECTED' ? 'rose' : 'amber'}>
                                 {a.status}
                               </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => a.student?.resumeUrl ? window.open(a.student.resumeUrl, "_blank") : toast.error("No resume")}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all cursor-pointer"
                          >
                            <FiDownload /> Resume
                          </button>
                          {a.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleAcceptReject(a.id, "ACCEPTED")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all cursor-pointer"
                              >
                                <FiCheckCircle /> Accept
                              </button>
                              <button
                                onClick={() => handleAcceptReject(a.id, "REJECTED")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all cursor-pointer"
                              >
                                <FiXCircle /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
