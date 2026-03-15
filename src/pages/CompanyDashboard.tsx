import { 
  FiMapPin, 
  FiCalendar, 
  FiPlus, 
  FiBriefcase, 
  FiUsers, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiArrowRight, 
  FiClock,
  FiSearch,
  FiUser
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import axios from "axios";
import type { Job } from "../types/job.types";
import type { Application } from "../types/application.types";
import { useAuth } from "../context/AuthContext";

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

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [activeJobsCount, setActiveJobsCount] = useState<number>(0);
  const [shortlistedCount, setShortlistedCount] = useState<number>(0);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);

  const token = localStorage.getItem("token");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const { user } = useAuth();

  const fetchJobPosts = async () => {
    if (!user?.id || !token) return;
    setLoadingJobs(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/company/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const jobs: Job[] = response.data?.data;
        setCompanyJobs(jobs);
        setActiveJobsCount(jobs.filter((job: Job) => job.status === "ACTIVE").length);
        const sorted = [...jobs].sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
        setRecentJobs(sorted.slice(0, 5));
      }
    } catch (err) {
      toast.error("Error in fetching jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchJobApplications = async () => {
    if (!user?.id || !token) return;
    setLoadingApplications(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/application/job/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const applications = response.data?.data;
        setJobApplications(applications);
        setShortlistedCount(applications.filter((app: Application) => app.status === "SHORTLISTED").length);
        const sorted = [...applications].sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
        setRecentApplications(sorted.slice(0, 5));
      }
    } catch (err) {
      toast.error("Error in fetching applications");
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchJobPosts();
    fetchJobApplications();
  }, [user?.id]);

  const stats = useMemo(() => [
    { label: "Total Jobs", val: companyJobs.length, icon: <FiBriefcase />, color: "slate" },
    { label: "Active Roles", val: activeJobsCount, icon: <FiTrendingUp />, color: "blue" },
    { label: "Total Applicants", val: jobApplications.length, icon: <FiUsers />, color: "emerald" },
    { label: "Shortlisted", val: shortlistedCount, icon: <FiCheckCircle />, color: "amber" },
  ], [companyJobs.length, activeJobsCount, jobApplications.length, shortlistedCount]);

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
              Company Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Manage your recruitment pipeline and active job postings.</p>
          </div>
          {/* <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/company/post-job")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer"
            >
              <FiPlus className="text-lg" /> Post New Job
            </button>
          </div> */}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
               <div className={`absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform
                  ${stat.color === 'slate' ? 'bg-slate-900' : ''}
                  ${stat.color === 'blue' ? 'bg-blue-600' : ''}
                  ${stat.color === 'emerald' ? 'bg-emerald-600' : ''}
                  ${stat.color === 'amber' ? 'bg-amber-600' : ''}
               `}></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl transition-transform group-hover:scale-110 shadow-sm shrink-0
                    ${stat.color === 'slate' ? 'bg-slate-50 text-slate-600' : ''}
                    ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                    ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
                  `}>
                    {stat.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest truncate">{stat.label}</p>
                    <h3 className="text-xl md:text-3xl font-black text-slate-900">{stat.val}</h3>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Recent Job Postings */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <FiBriefcase />
                </div>
                <h3 className="text-xl font-bold">Active Postings</h3>
              </div>
              <button 
                onClick={() => navigate("/company/manage-jobs")}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
              >
                Manage all <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm">
              {loadingJobs ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium mt-4">Syncing your active roles...</p>
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FiSearch className="text-3xl" />
                  </div>
                  <p className="text-slate-500 font-bold">No jobs posted yet.</p>
                  <p className="text-slate-400 text-sm mt-1">Start by posting your first job role.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((j) => (
                    <div key={j.id} className="group flex items-center justify-between p-5 border border-slate-50 rounded-2xl hover:border-blue-100 hover:bg-blue-50/10 transition-all gap-4">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                          <FiBriefcase />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors">{j.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                            <span className="flex items-center gap-1"><FiMapPin /> {j.location}</span>
                            <span className="flex items-center gap-1 text-rose-400/80"><FiClock /> Deadline: {new Date(j.deadline as string).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant={j.status === 'ACTIVE' ? 'green' : 'amber'}>{j.status}</Badge>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{j.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Recent Applications */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                  <FiUsers />
                </div>
                <h3 className="text-xl font-bold">New Applications</h3>
              </div>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group cursor-pointer">
                View pipeline <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm">
              {loadingApplications ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium mt-4">Reviewing new talent...</p>
                </div>
              ) : jobApplications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FiUsers className="text-3xl" />
                  </div>
                  <p className="text-slate-500 font-bold">No applications received.</p>
                  <p className="text-slate-400 text-sm mt-1">Applications will appear here once students apply.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="group flex items-center justify-between p-5 border border-slate-50 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/10 transition-all gap-4">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl shadow-inner shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {app.student?.name?.charAt(0) || "S"}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-900 text-lg truncate group-hover:text-emerald-700 transition-colors">{app.student?.name}</h4>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <p className="text-xs text-slate-500 font-medium truncate">{app.student?.email}</p>
                            <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mt-1 italic">Role: {app.job?.title}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant={app.status === 'SHORTLISTED' ? 'green' : 'default'}>{app.status}</Badge>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          <FiClock /> {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
