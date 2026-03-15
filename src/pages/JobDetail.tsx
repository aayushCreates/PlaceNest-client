import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiCheckCircle,
  FiInfo,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiGlobe,
  FiExternalLink,
  FiXCircle,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Job } from "../types/job.types";
import { toast } from "sonner";
import type { Application } from "../types/application.types";
import { FaTrophy } from "react-icons/fa";

const Badge = ({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "blue" | "green" | "amber" | "rose" | "indigo";
}) => {
  const variants = {
    default: "bg-slate-50 text-slate-600 border-slate-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };

  return (
    <span
      className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const InfoBlock = ({
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
}) => (
  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full">
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center text-lg shrink-0`}
      >
        <Icon />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
    <div className="text-slate-600 leading-relaxed">{children}</div>
  </div>
);

export default function JobDetails() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [jobDetail, setJobsDetail] = useState<Job>();
  const [applicationDetails, setApplicationDetails] = useState<Application>();
  const [jobLoading, setJobLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const { id } = useParams();

  const fetchJobDetail = async () => {
    setJobLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) setJobsDetail(response.data.data);
    } catch (err) {
      toast.error("Error in fetching job details");
    } finally {
      setJobLoading(false);
    }
  };

  const myApplicationDetails = async () => {
    setApplicationLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/application/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) setApplicationDetails(response.data.data);
    } catch (err) {
      // User hasn't applied
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/job/${id}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setApplicationDetails(response.data.data);
        toast.success("Successfully applied for this role!");
      }
    } catch (err) {
      toast.error("Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
    myApplicationDetails();
  }, [id]);

  const statusConfig: Record<string, { color: string; icon: any }> = {
    SHORTLISTED: {
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: <FiCheckCircle />,
    },
    PENDING: {
      color: "bg-amber-50 text-amber-700 border-amber-100",
      icon: <FiClock />,
    },
    REJECTED: {
      color: "bg-rose-50 text-rose-700 border-rose-100",
      icon: <FiXCircle />,
    },
    SELECTED: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: <FaTrophy />,
    },
  };

  if (jobLoading || applicationLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50/50">
        <SideBar />
        <main className="flex-1 ml-20 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">
              Loading Job Profile
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <button
              className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-blue-600 transition-colors group cursor-pointer"
              onClick={() => navigate("/student/jobs")}
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
              Back to Opportunities
            </button>
          </div>

          {/* Job Hero Card */}
          <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="flex items-start md:items-center gap-6 overflow-hidden">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-3xl shrink-0 uppercase shadow-inner">
                  {jobDetail?.company?.name?.charAt(0) || "J"}
                </div>
                <div className="overflow-hidden">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight truncate">
                      {jobDetail?.title}
                    </h1>
                    <Badge
                      variant={
                        jobDetail?.type === "Internship" ? "amber" : "green"
                      }
                    >
                      {jobDetail?.type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:text-base text-slate-500 font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <FiBriefcase className="text-blue-500" />{" "}
                      {jobDetail?.company?.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-blue-500" />{" "}
                      {jobDetail?.location}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold whitespace-nowrap">
                      <FiDollarSign className="text-emerald-500" /> ₹
                      {jobDetail?.salary}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 shrink-0 min-w-[220px]">
                {applicationDetails ? (
                  <div
                    className={`p-5 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${statusConfig[applicationDetails.status]?.color || "bg-slate-50 border-slate-100 shadow-inner"}`}
                  >
                    <div className="text-2xl">
                      {statusConfig[applicationDetails.status]?.icon}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Application {applicationDetails.status}
                    </p>
                    <p className="text-[9px] font-bold opacity-60">
                      Submitted on{" "}
                      {new Date(
                        applicationDetails.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-100 transition-all transform hover:-translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplying ? "Submitting..." : "Apply for this Role"}
                  </button>
                )}

                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <FiClock /> Posted Recently
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-500">
                    <FiCalendar /> Ends {jobDetail?.deadline}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Columns - Details */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <InfoBlock icon={FiFileText} title="Role Overview">
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-line text-slate-600">
                  {jobDetail?.description}
                </p>
              </InfoBlock>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <InfoBlock
                  icon={FiCheckCircle}
                  title="Eligible Branches"
                  iconBg="bg-indigo-50"
                  iconColor="text-indigo-600"
                >
                  <div className="flex flex-wrap gap-2">
                    {jobDetail?.branchCutOff?.map((dept) => (
                      <Badge key={dept} variant="indigo">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </InfoBlock>

                <InfoBlock
                  icon={FiClock}
                  title="Target Batches"
                  iconBg="bg-amber-50"
                  iconColor="text-amber-600"
                >
                  <div className="flex flex-wrap gap-2">
                    {["2024", "2025", "2026"].map((year) => (
                      <Badge key={year} variant="amber">
                        {year} Passing
                      </Badge>
                    ))}
                  </div>
                </InfoBlock>
              </div>
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="space-y-6 lg:space-y-8">
              {/* About Company Card */}
              <div className="bg-slate-900 rounded-3xl lg:rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                  <FiInfo className="text-blue-400" /> Recruiter Info
                </h3>

                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-xl font-black leading-tight mb-1">
                      {jobDetail?.company?.name}
                    </p>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">
                      {jobDetail?.company?.industry || "Technology Sector"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <FiGlobe className="shrink-0 text-blue-400" />
                      <a
                        href={jobDetail?.company?.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-400 underline truncate transition-colors"
                      >
                        {jobDetail?.company?.website?.replace(
                          /^https?:\/\//,
                          ""
                        ) || "Visit Website"}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <FiMapPin className="shrink-0 text-blue-400" />
                      <span className="truncate">
                        {jobDetail?.location} (Headquarters)
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer">
                    Full Profile <FiExternalLink />
                  </button>
                </div>
              </div>

              {/* Statistics Card */}
              <InfoBlock
                icon={FiUsers}
                title="Market Insights"
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
              >
                <div className="space-y-5">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Total Applicants
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      {jobDetail?.applications?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Hiring Status
                    </span>
                    <Badge
                      variant={jobDetail?.status === "OPEN" ? "green" : "rose"}
                    >
                      {jobDetail?.status || "OPEN"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Profile Match
                    </span>
                    <span className="font-black text-blue-600 text-xs flex items-center gap-1.5">
                      <FiCheckCircle /> Verified
                    </span>
                  </div>
                </div>
              </InfoBlock>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
