import {
  FiUsers,
  FiCheckCircle,
  FiBriefcase,
  FiAlertCircle,
  FiTrendingUp,
  FiArrowRight,
  FiPieChart,
  FiActivity,
  FiUser
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { StudentProfile } from "../types/student.types";
import type { Company } from "../types/companies.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getBranchWisePlacement = (students: any[], branch: string)=> {
    let totalPlace = 0;
    students.forEach((s: any)=> {
      if(s.branch === branch && s.isPlaced === true) {
        totalPlace++;
      }
    });
    return totalPlace;
}

const getBranchWiseStudents = (students: any[], branch: string)=> {
  let totalStudents = 0;
  students.forEach((s: any)=> {
    if(s.branch === branch) {
      totalStudents++;
    }
  });
  return totalStudents;
}

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalActiveJobs, setTotalActiveJobs] = useState<number>(0);
  const [totalStudentPlaced, setTotalStudentPlaced] = useState<number>(0);
  const [pendingStudentVerifications, setPendingStudentsVerifications] = useState<number>(0);
  const [pendingCompanyVerifications, setPendingCompanyVerifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let activeJobs = 0;
      if (Array.isArray(response.data.data)) {
        response.data.data.forEach((j: any) => {
          if (j.status === "ACTIVE") activeJobs++;
        });
      }
      setTotalActiveJobs(activeJobs);
    } catch (err) {
      toast.error("Error in fetching jobs");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/profile/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const studentData = response.data.data || [];
      setStudents(studentData);
      let totalPlacedStudents = 0;
      let totalPendingProfiles = 0;
      studentData.forEach((s: any) => {
        if (s.isPlaced) totalPlacedStudents++;
        if (s.verificationStatus === "PENDING") totalPendingProfiles++;
      });
      setTotalStudentPlaced(totalPlacedStudents);
      setPendingStudentsVerifications(totalPendingProfiles);
    } catch (err) {
      toast.error("Error in fetching students");
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/profile/company`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const companyData = response.data.data || [];
      setCompanies(companyData);
      let pendingCompany = 0;
      companyData.forEach((c: any) => {
        if (c.verificationStatus === "PENDING") pendingCompany++;
      });
      setPendingCompanyVerifications(pendingCompany);
    } catch (err) {
      toast.error("Error in fetching companies");
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchStudents(), fetchJobs(), fetchCompanies()]);
      setIsLoading(false);
    };
    loadAllData();
  }, []);

  const stats = useMemo(() => [
    { label: "Total Students", val: students.length, icon: <FiUsers />, color: "blue" },
    { label: "Registered Companies", val: companies.length, icon: <FiBriefcase />, color: "slate" },
    { label: "Active Jobs", val: totalActiveJobs, icon: <FiTrendingUp />, color: "amber" },
    { label: "Total Placements", val: totalStudentPlaced, icon: <FiCheckCircle />, color: "emerald" },
  ], [students.length, companies.length, totalActiveJobs, totalStudentPlaced]);

  const pendingActions = [
    {
      title: "Student Verifications",
      count: pendingStudentVerifications,
      color: "blue",
      onClick: () => navigate("/coordinator/manage-students")
    },
    {
      title: "Company Verifications",
      count: pendingCompanyVerifications,
      color: "emerald",
      onClick: () => navigate("/coordinator/manage-companies")
    },
  ];

  const departments = useMemo(() => {
    const branches = [
      { key: "CSE", name: "Computer Science" },
      { key: "ECE", name: "Electronics & Comm" },
      { key: "ME", name: "Mechanical Engineering" },
      { key: "CE", name: "Civil Engineering" },
      { key: "CY", name: "Cybersecurity" },
      { key: "EIC", name: "Electronics & Instrumental" },
    ];

    return branches.map((b) => {
      const total = getBranchWiseStudents(students, b.key);
      const placed = getBranchWisePlacement(students, b.key);
      const pct = total > 0 ? Math.round((placed / total) * 100) : 0;
      return { dep: b.name, key: b.key, total, placed, pct };
    });
  }, [students]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50/50">
        <SideBar />
        <main className="flex-1 ml-20 flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
              TPO Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">
              Welcome back, {currentUser?.name} • Placement cell oversight and management.
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm overflow-hidden relative group">
               <div className={`absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform
                  ${stat.color === 'slate' ? 'bg-slate-900' : ''}
                  ${stat.color === 'blue' ? 'bg-blue-600' : ''}
                  ${stat.color === 'emerald' ? 'bg-emerald-600' : ''}
                  ${stat.color === 'amber' ? 'bg-amber-600' : ''}
               `}></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shrink-0
                    ${stat.color === 'slate' ? 'bg-slate-50 text-slate-600' : ''}
                    ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                    ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Stats Area - 2 Columns */}
          <div className="xl:col-span-2 space-y-8">
            {/* Department Charts */}
            <section className="bg-white rounded-[2.5rem] p-6 md:p-8 lg:p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
                    <FiPieChart />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Department Metrics</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                  Placement Success
                </div>
              </div>

              <div className="space-y-6">
                {departments.map(({ dep, key, total, placed, pct }) => (
                  <div key={key} className="group p-4 md:p-5 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/10 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{dep}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                          {total} Enrolled • {placed} Secured Placement
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black
                          ${pct > 70 ? 'bg-emerald-50 text-emerald-600' : pct > 40 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out rounded-full
                          ${pct > 70 ? 'bg-emerald-500' : pct > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area - 1 Column */}
          <div className="space-y-8">
            {/* Pending Actions Card */}
            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
              
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                <FiAlertCircle className="text-rose-400" /> Pending Actions
              </h3>
              
              <div className="space-y-4 relative z-10">
                {pendingActions.map((action, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all cursor-pointer" onClick={action.onClick}>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{action.title}</p>
                      <h4 className="text-xl font-black">{action.count} <span className="text-[10px] text-slate-500">Waitlist</span></h4>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:translate-x-1
                      ${action.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      <FiArrowRight />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Activity Card */}
            <InfoBlock icon={FiActivity} title="Portal Activity" iconBg="bg-purple-50" iconColor="text-purple-600">
               <div className="space-y-5">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Jobs</span>
                    <span className="font-black text-slate-900 text-sm">{totalActiveJobs}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students</span>
                    <span className="font-black text-slate-900 text-sm">{students.length}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-tighter pt-4">
                    Live system status • {new Date().toLocaleTimeString()}
                  </p>
               </div>
            </InfoBlock>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  children,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center text-lg shrink-0`}>
          <Icon />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
