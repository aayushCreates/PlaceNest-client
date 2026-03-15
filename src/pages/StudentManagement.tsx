import { useEffect, useState, useMemo } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiCalendar,
  FiXCircle,
  FiSearch,
  FiX,
  FiUsers,
  FiActivity,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiInfo,
  FiAlertCircle,
  FiLinkedin,
  FiFileText
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { toast } from "sonner";
import axios from "axios";
import type { StudentVerification } from "../types/student.types";
import { LuUserRound } from "react-icons/lu";

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

export default function StudentManagement() {
  const [studentVerifyApplications, setStudentVerifyApplications] = useState<StudentVerification[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentVerification | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [branchFilter, setBranchFilter] = useState("All Departments");

  const [totalVerifiedStudents, setTotalVerifiedStudents] = useState<number>(0);
  const [totalPendingStudents, setTotalPendingStudents] = useState<number>(0);
  const [totalRejectedStudents, setTotalRejectedStudents] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchStudentVerficationApplication = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/verification`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const studentProfiles = response.data.data.filter((s: any) => s.role === "STUDENT");
      setStudentVerifyApplications(studentProfiles);

      let pending = 0, verified = 0, rejected = 0;
      studentProfiles.forEach((a: StudentVerification) => {
        if (a.verificationStatus === "PENDING") pending++;
        else if (a.verificationStatus === "APPROVED") verified++;
        else rejected++;
      });
      setTotalPendingStudents(pending);
      setTotalVerifiedStudents(verified);
      setTotalRejectedStudents(rejected);
    } catch (err) {
      toast.error("Error fetching student verification applications");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStudent = async (isVerified: boolean, updatedProfileId: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_API_URL}/verification/${updatedProfileId}`,
        { status: isVerified ? "APPROVED" : "REJECTED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Profile ${isVerified ? "approved" : "rejected"} successfully`);
        setStudentVerifyApplications(prev => prev.filter(s => s.id !== updatedProfileId));
        
        setTotalPendingStudents(prev => prev - 1);
        if (isVerified) setTotalVerifiedStudents(prev => prev + 1);
        else setTotalRejectedStudents(prev => prev + 1);
      }
    } catch (err) {
      toast.error("Error updating student verification status");
    }
  };

  useEffect(() => {
    fetchStudentVerficationApplication();
  }, []);

  const filteredStudents = useMemo(() => {
    return studentVerifyApplications.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || s.verificationStatus === statusFilter.toUpperCase();
      const matchesBranch = branchFilter === "All Departments" || s.branch === branchFilter;
      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [searchQuery, statusFilter, branchFilter, studentVerifyApplications]);

  const stats = useMemo(() => [
    { label: "Total Students", val: studentVerifyApplications.length, icon: <FiUsers />, color: "slate" },
    { label: "Verified", val: totalVerifiedStudents, icon: <FiUserCheck />, color: "emerald" },
    { label: "Pending", val: totalPendingStudents, icon: <FiActivity />, color: "amber" },
    { label: "Rejected", val: totalRejectedStudents, icon: <FiUserX />, color: "rose" },
  ], [studentVerifyApplications.length, totalVerifiedStudents, totalPendingStudents, totalRejectedStudents]);

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">Student Verifications</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Review and validate student profiles for portal access.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm overflow-hidden relative group">
               <div className={`absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform
                  ${stat.color === 'slate' ? 'bg-slate-900' : ''}
                  ${stat.color === 'emerald' ? 'bg-emerald-600' : ''}
                  ${stat.color === 'amber' ? 'bg-amber-600' : ''}
                  ${stat.color === 'rose' ? 'bg-rose-600' : ''}
               `}></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shrink-0
                    ${stat.color === 'slate' ? 'bg-slate-50 text-slate-600' : ''}
                    ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
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

        {/* Filters Bar */}
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 border border-slate-100 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search students by name or email..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer whitespace-nowrap min-w-[120px]"
              >
                <option>All Status</option>
                <option value="APPROVED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
              
              <select 
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer whitespace-nowrap min-w-[150px]"
              >
                <option>All Departments</option>
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
                <option>ME</option>
                <option>CE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Student Directory</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="col-span-full py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center">
               <FiUserPlus className="text-4xl text-slate-200 mb-4" />
               <p className="text-slate-500 font-bold">No students match your filters.</p>
            </div>
          ) : (
            filteredStudents.map((s) => (
              <div key={s.id} className="group bg-white rounded-3xl lg:rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all text-xl uppercase shadow-inner">
                    {s.name.charAt(0)}
                  </div>
                  <Badge variant={s.verificationStatus === 'APPROVED' ? 'green' : s.verificationStatus === 'PENDING' ? 'amber' : 'rose'}>
                    {s.verificationStatus}
                  </Badge>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">{s.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {s.id.slice(-8)}</p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <FiMail className="text-blue-400 shrink-0" /> <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <FiBookOpen className="text-blue-400 shrink-0" /> {s.branch} • {s.year} YEAR
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="flex-1 py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LuUserRound /> Profile
                  </button>

                  {s.verificationStatus === "APPROVED" ? (
                    <button 
                      onClick={() => handleVerifyStudent(false, s.id)}
                      className="px-4 py-3 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center"
                    >
                      Revoke
                    </button>
                  ) : (
                    <div className="flex gap-2 flex-1">
                      <button
                        onClick={() => handleVerifyStudent(true, s.id)}
                        className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyStudent(false, s.id)}
                        className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all cursor-pointer"
                      >
                        <FiXCircle />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ✅ Profile Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer z-10"
            >
              <FiX size={20} />
            </button>

            <div className="p-8 lg:p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                <FiUser className="text-4xl text-blue-600" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedStudent.name}</h2>
              <p className="text-slate-500 font-medium mt-1 mb-4">{selectedStudent.email}</p>
              
              <Badge variant={selectedStudent.verificationStatus === 'APPROVED' ? 'green' : selectedStudent.verificationStatus === 'PENDING' ? 'amber' : 'rose'}>
                {selectedStudent.verificationStatus}
              </Badge>

              <div className="w-full mt-8 space-y-3">
                {[
                  { label: "Phone", val: selectedStudent.phone, icon: <FiPhone /> },
                  { label: "Branch", val: selectedStudent.branch, icon: <FiBookOpen /> },
                  { label: "Batch", val: `${selectedStudent.year} YEAR`, icon: <FiCalendar /> },
                  { label: "CGPA", val: selectedStudent.cgpa || "N/A", icon: <FiActivity /> },
                  { label: "Backlogs", val: selectedStudent.backlogs ?? "N/A", icon: <FiAlertCircle /> },
                  { label: "Backlog Status", val: selectedStudent.activeBacklog ? "Active" : "None", icon: <FiAlertCircle /> },
                  { label: "Student ID", val: selectedStudent.id.slice(-8), icon: <FiInfo /> }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span className="text-blue-500">{item.icon}</span> {item.label}
                    </span>
                    <span className="text-sm font-black text-slate-900">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => selectedStudent.linkedinUrl ? window.open(selectedStudent.linkedinUrl, "_blank") : toast.error("LinkedIn URL not provided")}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <FiLinkedin /> LinkedIn
                </button>
                <button
                  onClick={() => selectedStudent.resumeUrl ? window.open(selectedStudent.resumeUrl, "_blank") : toast.error("Resume not provided")}
                  className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <FiFileText /> View Resume
                </button>
              </div>
              
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full mt-6 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
