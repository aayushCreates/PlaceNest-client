import {
  FiClock,
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiEye,
  FiUsers,
  FiX,
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

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

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
          headers: { Authorization: `Bearer ${token}` },
        }
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

      console.log(response.data.data);

      let applications: any[] = [];

      response.data.data.map((j: any)=> {
        j.applications.map((a: any)=> {
          applications.push(a);
        })
      })
      setJobApplications(applications);
    } catch {
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchJobs();
  }, [user?.id]);

  // const fetchApplications = async (jobId: string) => {
  //   if (!token) return;
  //   setModalLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BASE_API_URL}/job/${jobId}/applications`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setJobApplications(res.data.data || []);
  //   } catch {
  //     toast.error("Error loading applications");
  //   } finally {
  //     setModalLoading(false);
  //   }
  // };

  const handleOpenModal = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
    // fetchApplications(job.id as string);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
    setJobApplications([]);
  };

  const handleAcceptReject = async (appId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_API_URL}/application/${appId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Application ${status.toLowerCase()}`);
      setJobApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    } catch {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SideBar />

      <main className="flex-1 p-8 pl-72">
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
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div className={`${s.boxCss} flex`} key={s.heading}>
                {s.icon}
                <div className="flex gap-3">
                  <span className={`${s.contentCss} text-md font-semibold`}>
                    {s.heading}
                  </span>
                  <span className={`${s.contentCss} font-semibold`}>
                    {s.data}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* Job Cards */}
          <section>
            <h3 className="text-lg font-semibold mb-4">
              Your Jobs ({companyJobs.length})
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : companyJobs.length === 0 ? (
              <p className="text-gray-500 text-sm">No jobs posted yet.</p>
            ) : (
              companyJobs.map((j, idx) => (
                <div
                  className="border border-black/10 p-6 rounded-md space-y-4"
                  key={idx}
                >
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
                      <FiCalendar /> {j.createdAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock /> Deadline {j.deadline}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{j.description}</p>

                  <div className="flex justify-end gap-3">
                    <button className="flex items-center gap-2 border border-black/10 px-4 py-2 rounded text-sm hover:bg-gray-50">
                      <FiEye /> Preview
                    </button>
                    <button
                      onClick={() => handleOpenModal(j)}
                      className="flex items-center gap-2 bg-blue-400/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded text-sm hover:bg-blue-700/10"
                    >
                      <FiUsers /> View Applications
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </main>

      {/* Modal for Applications */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white w-full max-w-2xl p-6 rounded-md shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              Applications for {selectedJob?.title}
            </h3>

            {modalLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : jobApplications.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {jobApplications.map((a) => (
                  <div
                    key={a.id}
                    className="border border-black/10 p-4 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{a.applicant?.name}</p>
                      <p className="text-sm text-gray-500">
                        {a.applicant?.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        Status:{" "}
                        <span className="font-medium text-gray-700">
                          {a.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/company/student/${a.applicant.id}`)
                        }
                        className="border border-blue-500 text-blue-500 px-2 py-1 rounded text-xs hover:bg-blue-50"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleAcceptReject(a.id, "ACCEPTED")}
                        className="border border-green-500 text-green-500 px-2 py-1 rounded text-xs hover:bg-green-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAcceptReject(a.id, "REJECTED")}
                        className="border border-red-500 text-red-500 px-2 py-1 rounded text-xs hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
