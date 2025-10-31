import {
  FiClock,
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiUsers,
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import type { Job } from "../types/job.types";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [totalActiveJobs, setTotalActiveJobs] = useState<number>(0);
  const [totalPendingJobs, setTotalPendingJobs] = useState<number>(0);
  const token = localStorage.getItem("token");
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>();

  const stats = [
    {
      heading: "Total Jobs",
      data: companyJobs.length,
      icon: <FiBriefcase className="h-6 w-6" />,
      boxCss:
        "border border-gray-500/20 rounded-md bg-gray-300/10 p-4 flex items-center gap-4",
      contentCss: "text-neutral-500",
    },
    {
      heading: "Active Jobs",
      data: totalActiveJobs,
      icon: <FiClock className="h-6 w-6 text-blue-500" />,
      boxCss:
        "border border-blue-500/20 rounded-md bg-blue-400/10 p-4 flex items-center gap-4",
      contentCss: "text-blue-500",
    },
    {
      heading: "Total Applications",
      data: 1,
      icon: <FiUsers className="h-6 w-6 text-red-500" />,
      boxCss:
        "border border-red-500/20 rounded-md bg-red-400/10 p-4 flex items-center gap-4 p-4 flex items-center gap-4",
      contentCss: "text-red-500",
    },
    {
      heading: "Pending Jobs",
      data: totalPendingJobs,
      icon: <FiClock className="h-6 w-6 text-green-500" />,
      boxCss:
        "border border-green-500/20 rounded-md bg-green-400/10 p-4 flex items-center gap-4",
      contentCss: "text-green-500",
    },
  ];

  const fetchJobs = async () => {
    if (!user?.id || !token) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/company/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jobs = response.data.data;
      setCompanyJobs(jobs);

      let pendingJobs = 0;
      let activeJobs = 0;
      jobs.forEach((j: any) => {
        if (j.status === "ACTIVE") activeJobs++;
        else if (j.status === "DRAFT") pendingJobs++;
      });

      setTotalActiveJobs(activeJobs);
      setTotalPendingJobs(pendingJobs);
    } catch (err) {
      toast.error("Error in fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user?.id]);
  

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SideBar />

      <main className="flex-1 p-8 pl-72">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6">
          <h2 className="text-2xl font-bold">Manage Jobs</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            onClick={() => navigate("/company/post-job")}
          >
            + Post New Job
          </button>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div className={`${s.boxCss} flex`} key={s.heading}>
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
          <section className="border border-black/10 p-6 rounded-md space-y-4">
            <h3 className="font-semibold text-lg">Filter Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or location..."
                  className="pl-10 pr-4 py-2 w-full border border-black/20 rounded-md bg-gray-50"
                />
              </div>
              <select className="border border-black/20 px-3 py-2 rounded-md bg-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Expired</option>
              </select>
              <select className="border border-black/20 px-3 py-2 rounded-md bg-white">
                <option>All Types</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Internship</option>
              </select>
            </div>
          </section>

          {/* Job Cards */}
          <section>
            <h3 className="text-lg font-semibold mb-4">
              Your Jobs ({companyJobs.length})
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex justify-center items-center py-12">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : companyJobs.length === 0 ? (
              <p className="text-gray-500 text-sm">No jobs posted yet.</p>
            ) : (
              companyJobs.map((j,idx) => (
                <div className="border border-black/10 p-6 rounded-md space-y-4" key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-semibold">{j.title}</h4>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-sm shadow-xs">
                          {j.status}
                        </span>
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-sm shadow-xs">
                          {j.deadline}
                        </span>
                      </div>
                    </div>
                    {/* <button className="text-gray-500 hover:text-gray-700 text-xl">
                    ⋯
                  </button> */}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiMapPin /> {j.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiBriefcase /> {j.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiDollarSign /> {j.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar /> Posted {j.createdAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock /> Deadline {j.deadline}
                    </div>
                    {/* <div className="flex items-center gap-1">
                    <FiUsers /> {} applications
                  </div> */}
                  </div>

                  <p className="text-sm text-gray-600">{j.description}</p>

                  {/* <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                    React
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                    TypeScript
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                    HTML/CSS
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-sm rounded">
                    +1 more
                  </span>
                </div> */}

                  <div className="flex justify-end gap-3">
                    <button className="flex items-center gap-2 border border-black/10 px-4 py-2 rounded text-sm hover:bg-gray-50 hover:cursor-pointer">
                      <FiEye /> Preview
                    </button>
                    <button className="flex items-center gap-2 bg-blue-400/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded text-sm hover:bg-blue-700/10 hover:cursor-pointer">
                      <FiUsers /> 1 Applicants
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
