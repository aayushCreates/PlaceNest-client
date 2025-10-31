import { useEffect, useState } from "react";
import {
  FiSearch,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiEye,
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { toast } from "sonner";
import axios from "axios";

type Application = {
  id: string;
  name: string;
  email: string;
  degree: string;
  appliedOn: string;
  position: string;
  status: "shortlisted" | "pending" | "rejected" | "selected";
};

const MOCK: Application[] = [
  {
    id: "1",
    name: "John Doe",
    email: "student@test.com",
    degree: "Computer Science",
    appliedOn: "1/16/2024",
    position: "Software Engineer - Frontend",
    status: "shortlisted",
  },
  {
    id: "2",
    name: "John Doe",
    email: "student@test.com",
    degree: "Computer Science",
    appliedOn: "1/21/2024",
    position: "Unknown Job",
    status: "pending",
  },
  {
    id: "3",
    name: "John Doe",
    email: "student@test.com",
    degree: "Computer Science",
    appliedOn: "1/19/2024",
    position: "Unknown Job",
    status: "rejected",
  },
];

const stats = [
  {
    heading: "Total Applications",
    data: 3,
    icon: <FiUser className="h-6 w-6" />,
    boxCss:
      "border border-gray-500/20 rounded-md bg-gray-300/10 p-4 flex items-center gap-4",
    contentCss: "text-neutral-500",
  },
  {
    heading: "Shortlisted",
    data: 1,
    icon: <FiCheckCircle className="h-6 w-6 text-blue-500" />,
    boxCss:
      "border border-blue-500/20 rounded-md bg-blue-400/10 p-4 flex items-center gap-4",
    contentCss: "text-blue-500",
  },
  {
    heading: "Rejected",
    data: 1,
    icon: <FiXCircle className="h-6 w-6 text-red-500" />,
    boxCss:
      "border border-red-500/20 rounded-md bg-red-400/10 p-4 flex items-center gap-4 p-4 flex items-center gap-4",
    contentCss: "text-red-500",
  },
  {
    heading: "Selected",
    data: 0,
    icon: <FiCheckCircle className="h-6 w-6 text-green-500" />,
    boxCss:
      "border border-green-500/20 rounded-md bg-green-400/10 p-4 flex items-center gap-4",
    contentCss: "text-green-500",
  },
];

export default function StudentJobApplications() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [initialJobApplications, setInitialJobApplications] = useState<
    Application[]
  >([]);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);

  
  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/application`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.success) {
        setInitialJobApplications(response.data?.data);
        setJobApplications(response.data?.data);
        toast.success(response.data?.success);
      }
    } catch (err) {
      toast.error("Error in fetching applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // const filtered = MOCK.filter((a) => {
  //   if (statusFilter !== "all" && a.status !== statusFilter) return false;
  //   if (!query) return true;
  //   const q = query.toLowerCase();
  //   return (
  //     a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
  //   );
  // });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <div className="flex">
        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <main className="flex-1 p-8 pl-72">
          <header className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Applicant Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                Review and manage applications for your jobs
              </p>
            </div>
          </header>

          {/* stat cards */}
          <section className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div className={`${s.boxCss}flex`} key={s.heading}>
                {s.icon}
                <div className="flex gap-3">
                  <span className={`${s.contentCss} text-md font-semibold`}>
                    {s.heading}{" "}
                  </span>
                  <span className={`${s.contentCss} font-semibold`}>
                    {s.data}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* Filters */}
          <section className="bg-white border border-black/10 rounded p-6 mb-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">🔎</span> Filter Applications
            </h4>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Search
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-10 pr-4 py-2 w-full border border-black/20 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-full py-2 px-3 border border-black/20 rounded-md bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="selected">Selected</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Job Position
                </label>
                <div className="relative">
                  <select className="appearance-none w-full py-2 px-3 border border-black/20 rounded-md bg-white">
                    <option>All Jobs</option>
                    <option>Software Engineer - Frontend</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
          </section>

          {/* Applications list */}
          {/* Applications list (Table View) */}
          <section className="bg-white border border-black/10 rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  Applications ({jobApplications.length})
                </h3>
                <p className="text-sm text-gray-500">
                  Review and take action on applications
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Job Position</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500 text-sm"
                      >
                        🚫 No applications found.
                      </td>
                    </tr>
                  ) : (
                    jobApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-semibold">
                            {app.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {app.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {app.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{app.position}</td>
                        <td className="py-3 px-4">{app.degree}</td>
                        <td className="py-3 px-4">{app.appliedOn}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button className="text-gray-600 hover:text-blue-500">
                            <FiEye />
                          </button>
                          {app.status === "pending" && (
                            <>
                              <button className="text-blue-500 hover:text-blue-700">
                                <FiCheckCircle />
                              </button>
                              <button className="text-red-500 hover:text-red-700">
                                <FiXCircle />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <FiUser />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  const map = {
    shortlisted: {
      text: "SHORTLISTED",
      className: "bg-green-100 text-green-700 rounded-sm shadow-xs",
    },
    pending: {
      text: "PENDING",
      className: "bg-yellow-100 text-yellow-700 rounded-sm shadow-xs",
    },
    rejected: {
      text: "REJECTED",
      className: "bg-red-100 text-red-700 rounded-sm shadow-xs",
    },
    selected: {
      text: "SELECTED",
      className: "bg-green-100 text-green-700 rounded-sm shadow-xs",
    },
  } as const;
  const info = map[status];
  return (
    <div
      className={`px-3 py-1 text-xs rounded-full font-semibold ${info.className}`}
    >
      {info.text}
    </div>
  );
}
