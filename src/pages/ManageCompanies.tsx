import React, { useEffect, useState, useMemo } from "react";
import {
  FiHome,
  FiCheckCircle,
  FiClock,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiActivity,
  FiGlobe,
  FiX,
  FiUser
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import type { Company } from "../types/companies.types";
import axios from "axios";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const industries = [
  "All Industries",
  "Software Development",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

const statusOptions = ["All Status", "Pending", "Approved", "Rejected"];

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

const ManageCompanies: React.FC = () => {
  const navigate = useNavigate();
  const [companiesProfiles, setCompaniesProfiles] = useState<Company[]>([]);
  const [totalCompaniesProfiles, setTotalCompaniesProfiles] = useState<Company[]>([]);
  const [totalVerifiedCompanies, setTotalVerifiedCompanies] = useState<number>(0);
  const [totalPendingVerifications, setTotalPendingVerifications] = useState<number>(0);
  const [totalRejectedCompanies, setTotalRejectedCompanies] = useState<number>(0);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [loading, setLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  
  const token = localStorage.getItem("token");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/verification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredProfiles = response.data.data.filter((c: any) => c.role === "COMPANY");
      setCompaniesProfiles(filteredProfiles);
      setTotalCompaniesProfiles(filteredProfiles);

      let pending = 0, verified = 0, rejected = 0;
      filteredProfiles.forEach((p: Company) => {
        if (p.verificationStatus === "APPROVED") verified++;
        else if (p.verificationStatus === "PENDING") pending++;
        else rejected++;
      });
      setTotalPendingVerifications(pending);
      setTotalVerifiedCompanies(verified);
      setTotalRejectedCompanies(rejected);
    } catch (err) {
      toast.error("Error in fetching company verification data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCompany = async (isVerified: boolean, updatedProfileId: string) => {
    setVerifyingId(updatedProfileId);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_API_URL}/verification/${updatedProfileId}`,
        { status: isVerified ? "APPROVED" : "REJECTED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Profile ${isVerified ? "approved" : "rejected"} successfully`);
        setCompaniesProfiles(prev => prev.filter(c => c.id !== updatedProfileId));
        setTotalCompaniesProfiles(prev => prev.filter(c => c.id !== updatedProfileId));

        setTotalPendingVerifications(prev => prev - 1);
        if (isVerified) setTotalVerifiedCompanies(prev => prev + 1);
        else setTotalRejectedCompanies(prev => prev + 1);
      }
    } catch (err) {
      toast.error("Error updating company status");
    } finally {
      setVerifyingId(null);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return totalCompaniesProfiles.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || c.verificationStatus === statusFilter.toUpperCase();
      const matchesIndustry = industryFilter === "All Industries" || c.industry === industryFilter;
      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [searchQuery, statusFilter, industryFilter, totalCompaniesProfiles]);

  const stats = useMemo(() => [
    { label: "Total Companies", val: totalCompaniesProfiles.length, icon: <FiBriefcase />, color: "slate" },
    { label: "Verified Partners", val: totalVerifiedCompanies, icon: <FiCheckCircle />, color: "emerald" },
    { label: "Pending Review", val: totalPendingVerifications, icon: <FiActivity />, color: "amber" },
    { label: "Rejected", val: totalRejectedCompanies, icon: <FiXCircle />, color: "rose" },
  ], [totalCompaniesProfiles.length, totalVerifiedCompanies, totalPendingVerifications, totalRejectedCompanies]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCompany(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">Company Directory</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Verify corporate partners and manage campus recruitment access.</p>
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
                placeholder="Search companies by name or email..."
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
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <select 
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer whitespace-nowrap min-w-[150px]"
              >
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Partner Records</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="col-span-full py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center">
               <TbBuildingSkyscraper className="text-4xl text-slate-200 mb-4" />
               <p className="text-slate-500 font-bold">No companies match your filters.</p>
            </div>
          ) : (
            filteredCompanies.map((c) => (
              <div key={c.id} className="group bg-white rounded-3xl lg:rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all text-xl uppercase shadow-inner">
                    {c.name.charAt(0)}
                  </div>
                  <Badge variant={c.verificationStatus === 'APPROVED' ? 'green' : c.verificationStatus === 'PENDING' ? 'amber' : 'rose'}>
                    {c.verificationStatus}
                  </Badge>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">{c.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{c.industry}</p>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <FiMail className="text-blue-400 shrink-0" /> <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <FiMapPin className="text-blue-400 shrink-0" /> <span className="truncate">{c.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <FiGlobe className="text-blue-400 shrink-0" /> <span className="truncate">{c.website?.replace(/^https?:\/\//, '') || "N/A"}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCompany(c)}
                    className="flex-1 py-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <TbBuildingSkyscraper className="text-lg" /> Profile
                  </button>

                  {c.verificationStatus === "PENDING" && (
                    <div className="flex gap-2 flex-1">
                      <button
                        onClick={() => handleVerifyCompany(true, c.id)}
                        disabled={verifyingId === c.id}
                        className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {verifyingId === c.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Verifying...
                          </>
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        onClick={() => handleVerifyCompany(false, c.id)}
                        disabled={verifyingId === c.id}
                        className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all cursor-pointer disabled:opacity-50"
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

      {/*  Company Modal */}
      {selectedCompany && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCompany(null)}
        >
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer z-10"
            >
              <FiX size={20} />
            </button>

            <div className="overflow-y-auto no-scrollbar">
              <div className="p-8 lg:p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner shrink-0">
                  <TbBuildingSkyscraper className="text-4xl text-blue-600" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 leading-tight break-words w-full">{selectedCompany.name}</h2>
                <p className="text-slate-500 font-medium mt-1 mb-4">{selectedCompany.industry}</p>
                
                <Badge variant={selectedCompany.verificationStatus === 'APPROVED' ? 'green' : selectedCompany.verificationStatus === 'PENDING' ? 'amber' : 'rose'}>
                  {selectedCompany.verificationStatus}
                </Badge>

                <div className="w-full mt-8 space-y-3">
                  {[
                    { label: "Official Email", val: selectedCompany.email, icon: <FiMail /> },
                    { label: "Contact Phone", val: selectedCompany.phone, icon: <FiPhone /> },
                    { label: "Headquarters", val: selectedCompany.location, icon: <FiMapPin /> },
                    { label: "Official Website", val: selectedCompany.website, icon: <FiGlobe /> },
                    { label: "Founded Year", val: selectedCompany.founded, icon: <FiCalendar /> }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-2 sm:gap-4">
                      <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        <span className="text-blue-500">{item.icon}</span> {item.label}
                      </span>
                      <span className="text-sm font-black text-slate-900 truncate text-left sm:text-right w-full sm:max-w-[240px]">
                        {item.val || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedCompany.description && (
                  <div className="w-full mt-6 p-5 bg-blue-50/30 rounded-2xl border border-blue-100 text-left italic">
                    <p className="text-xs text-slate-600 leading-relaxed break-words">"{selectedCompany.description}"</p>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCompanies;
