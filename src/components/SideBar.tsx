import { useEffect, useMemo, useState } from "react";
import {
  FiUser,
  FiBriefcase,
  FiFileText,
  FiMessageSquare,
  FiLinkedin,
  FiChevronRight
} from "react-icons/fi";
import { MdDashboard, MdLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { IconType } from "react-icons";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiPassValidLine } from "react-icons/ri";
import { FaRegBuilding } from "react-icons/fa";

type SideBarType = {
  label: string;
  icon: IconType;
  tab: string;
  route: string;
};

const studentSidebarItems: SideBarType[] = [
  { label: "Dashboard", icon: MdDashboard, tab: "dashboard", route: "/student/dashboard" },
  { label: "Profile", icon: FiUser, tab: "profile", route: "/profile" },
  { label: "Campus Jobs", icon: FiBriefcase, tab: "jobs", route: "/student/jobs" },
  { label: "Applications", icon: FiFileText, tab: "applications", route: "/student/applications" },
  { label: "Other Jobs", icon: FiBriefcase, tab: "other-jobs", route: "/other-jobs" },
  { label: "Resume Assistant", icon: FiMessageSquare, tab: "resume", route: "/student/resume-review" },
];

const companySidebarItems: SideBarType[] = [
  { label: "Dashboard", icon: MdDashboard, tab: "dashboard", route: "/company/dashboard" },
  { label: "Profile", icon: FiUser, tab: "profile", route: "/profile" },
  { label: "Post Jobs", icon: IoMdAddCircleOutline, tab: "post-jobs", route: "/company/post-job" },
  { label: "My Jobs", icon: FiBriefcase, tab: "manage-jobs", route: "/company/manage-jobs" },
];

const coordinatorSidebarItems: SideBarType[] = [
  { label: "Dashboard", icon: MdDashboard, tab: "dashboard", route: "/coordinator/dashboard" },
  { label: "Profile", icon: FiUser, tab: "profile", route: "/profile" },
  { label: "Students Verification", icon: RiPassValidLine, tab: "verify-students", route: "/coordinator/manage-students" },
  { label: "Companies Verifications", icon: FaRegBuilding, tab: "companies", route: "/coordinator/manage-companies" },
  { label: "JobBoard Jobs", icon: FiBriefcase, tab: "other-jobs", route: "/other-jobs" },
  { label: "Linkedin Posts", icon: FiLinkedin, tab: "linkedin-posts", route: "/linkedin-posts" }
];

const SideBar = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const roleLabel = useMemo(() => {
    if (user?.role === "STUDENT") return "Student Portal";
    if (user?.role === "COMPANY") return "Recruiter Portal";
    if (user?.role === "COORDINATOR") return "TPO Portal";
    return "Portal";
  }, [user?.role]);

  const sidebarItems = useMemo(() => {
    if (user?.role === "STUDENT") return studentSidebarItems;
    if (user?.role === "COMPANY") return companySidebarItems;
    if (user?.role === "COORDINATOR") return coordinatorSidebarItems;
    return [];
  }, [user?.role]);

  useEffect(() => {
    if (!user?.role) return;
    const currItem = sidebarItems.find((item) =>
      location.pathname.startsWith(item.route)
    );
    if (currItem) setActiveTab(currItem.tab);
  }, [location.pathname, sidebarItems, user?.role]);

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed top-0 left-0 flex flex-col z-40 shadow-sm">
      {/* Branding Section */}
      <div className="p-8 pb-10">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <span className="text-white font-black text-xl">P</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Place<span className="text-blue-600">Nest</span>
          </h1>
        </div>
        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
          {roleLabel}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <nav className="space-y-1.5">
          {sidebarItems.map(({ label, icon: Icon, tab, route }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={label}
                onClick={() => {
                  setActiveTab(tab);
                  navigate(`${route}`);
                }}
                className={`w-full group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer
                  ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : ''}`}>
                    <Icon />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{label}</span>
                </div>
                {isActive && <FiChevronRight className="text-blue-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Section */}
      <div className="p-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-md">
              {user?.name?.charAt(0) || "U"}
           </div>
           <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{user?.role}</p>
           </div>
        </div>
        
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold text-sm cursor-pointer group"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <MdLogout className="text-lg group-hover:rotate-12 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
