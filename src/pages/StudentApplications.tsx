import React, { useEffect, useState } from "react";
import { FiEye, FiMapPin } from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import type { Application } from "../types/application.types";

const tabs = [
  { label: "All", status: "All" },
  { label: "Pending", status: "PENDING" },
  { label: "Shortlisted", status: "SHORTLISTED" },
  { label: "Rejected", status: "REJECTED" },
  { label: "Selected", status: "SELECTED" },
];

const StudentApplications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [currTab, setCurrTab] = useState<
    "All" | "Pending" | "Rejected" | "Shortlisted" | "Selected"
  >("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const statusColors: Record<Application["status"], string> = {
    SHORTLISTED: "text-green-600 bg-green-50 border-green-200",
    PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
    REJECTED: "text-red-600 bg-red-50 border-red-200",
    SELECTED: "text-blue-600 bg-blue-50 border-blue-200",
  };

  // --- Fetch Applications ---
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

      const apps = response.data.data;
      setApplications(apps);
      setFilteredApps(apps);
    } catch (err) {
      toast.error("Error fetching student applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // --- Filter by Tab ---
  useEffect(() => {
    if (currTab === "All") {
      setFilteredApps(applications);
    } else {
      setFilteredApps(
        applications.filter((a) => a.status === currTab.toUpperCase())
      );
    }
  }, [currTab, applications]);

  // --- Stats ---
  const totalStats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
    selected: applications.filter((a) => a.status === "SELECTED").length,
  };

  // --- Empty State ---
  if (!isLoading && applications.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideBar />
        <main className="flex-1 pl-72 p-8">
          <h1 className="text-2xl font-bold mb-1">My Applications</h1>
          <p className="text-gray-500 mb-8">
            Track the status of your job applications
          </p>
          <EmptyState />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 pl-72 p-8">
        {/* --- Header --- */}
        <h1 className="text-2xl font-bold mb-1">My Applications</h1>
        <p className="text-gray-500 mb-6">
          Track the status of your job applications
        </p>

        {/* --- Stats --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Applications"
            count={totalStats.total}
            color="gray"
          />
          <StatCard title="Pending" count={totalStats.pending} color="yellow" />
          <StatCard
            title="Shortlisted"
            count={totalStats.shortlisted}
            color="green"
          />
          <StatCard title="Rejected" count={totalStats.rejected} color="red" />
        </div>

        {/* --- Tabs --- */}
        <div className="bg-white border border-black/10 rounded-md p-4 mb-6 shadow-xs">
          <h3 className="font-semibold mb-3">Application Status</h3>
          <div className="flex gap-4 py-2 rounded-md text-sm bg-gray-50 justify-center items-center flex-wrap">
            {tabs.map(({ label, status }) => (
              <button
                key={status}
                onClick={() => setCurrTab(label as typeof currTab)}
                className={`px-3 py-1 relative transition-colors ${
                  currTab === label
                    ? "text-blue-600 font-medium after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {label} (
                {status === "All"
                  ? applications.length
                  : applications.filter((a) => a.status === status).length}
                )
              </button>
            ))}
          </div>
        </div>

        {/* --- Applications List --- */}
        <div className="space-y-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredApps.length === 0 ? (
            <EmptyState message="No applications found for this status" />
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-md border border-gray-200 shadow-xs hover:shadow-sm transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {app.job?.title}
                    </h2>
                    <p className="text-gray-500">{app.job?.company.name}</p>
                    <div className="flex gap-6 mt-2 text-sm text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <FiMapPin /> {app.job?.location}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-sm shadow-xs border ${
                      statusColors[app.status]
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                  {app.job?.description}
                </p>

                {/* Footer */}
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 border border-black/10 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2 text-sm transition hover:cursor-pointer"
                    onClick={() =>
                      navigate(`/student/job/${app.job?.id || ""}`)
                    }
                  >
                    <FiEye /> View Details
                  </button>
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

const StatCard = ({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: "gray" | "blue" | "green" | "red" | "yellow";
}) => {
  const colors: Record<string, string> = {
    gray: "border-gray-200 bg-gray-50 text-gray-700",
    blue: "border-blue-200 bg-blue-50 text-blue-600",
    green: "border-green-200 bg-green-50 text-green-600",
    red: "border-red-200 bg-red-50 text-red-600",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-600",
  };
  return (
    <div
      className={`flex items-center justify-between p-4 shadow-xs border rounded-md ${colors[color]}`}
    >
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center py-16">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-3 text-gray-500">Loading applications...</p>
  </div>
);

const EmptyState = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-20">
    <h2 className="text-gray-500 text-lg font-medium">
      {message || "No applications found"}
    </h2>
  </div>
);
