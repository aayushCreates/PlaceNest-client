import { FiMapPin, FiCalendar, FiPlus } from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import type { Job } from "../types/job.types";
import type { Application } from "../types/application.types";
import { useAuth } from "../context/AuthContext";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [activeJobs, setActiveJobs] = useState<number>(0);
  const [shortlistedApplications, setShortlistedApplications] =
    useState<number>(0);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const jobs: Job[] = response.data?.data;
        setCompanyJobs(jobs);
        setActiveJobs(
          jobs.filter((job: Job) => job.status === "ACTIVE").length
        );

        const recentJobs: Job[] = [...jobs]
          .sort(
            (a, b) =>
              new Date(b.createdAt as string).getTime() -
              new Date(a.createdAt as string).getTime()
          )
          .slice(0, 5);

        setRecentJobs(recentJobs);
      }
    } catch (err) {
      toast.error("Error in fetching jobs");
      console.error(err);
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const applications = response.data?.data;
        setJobApplications(applications);
        setShortlistedApplications(
          applications.filter(
            (app: Application) => app.status === "SHORTLISTED"
          ).length
        );

        const recentApp: Application[] = [...applications]
          .sort(
            (a, b) =>
              new Date(b.createdAt as string).getTime() -
              new Date(a.createdAt as string).getTime()
          )
          .slice(0, 5);

        setRecentApplications(recentApp);
      }
    } catch (err) {
      toast.error("Error in fetching job applications");
      console.error(err);
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(()=> {
    fetchJobPosts();
    fetchJobApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <div className="flex">
        <SideBar />

        <main className="flex-1 p-8 pl-72">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Company Dashboard</h2>
              <p className="text-sm text-gray-500">
                Manage your job postings and recruitment
              </p>
            </div>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-2 hover:cursor-pointer"
              onClick={() => navigate("/company/post-job")}
            >
              <FiPlus /> Post New Job
            </button>
          </header>

          {/* Stat cards */}
          <section className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Jobs Posted"
              titleCss="text-lg text-gray-500"
              value={companyJobs.length}
              boxCss="border border-gray-600/20 rounded-md bg-white p-4 flex item-center justify-between"
            />
            <StatCard
              title="Active Jobs"
              titleCss="text-lg text-blue-500"
              value={activeJobs}
              boxCss="border border-blue-600/20 rounded-md bg-white p-4 flex item-center justify-between"
            />
            <StatCard
              title="Total Applications"
              titleCss="text-lg text-green-500"
              value={jobApplications.length}
              boxCss="border border-green-600/20 rounded-md bg-white p-4 flex item-center justify-between"
            />
            <StatCard
              title="Shortlisted"
              titleCss="text-lg text-yellow-500"
              value={shortlistedApplications}
              boxCss="border border-yellow-600/20 rounded-md bg-white p-4 flex item-center justify-between"
            />
          </section>

          {/* Job Postings & Applications */}
          <section className="grid grid-cols-2 gap-6 mb-6">
            {/* Recent Job Postings */}
            <div className="bg-white border border-blue-600/10 rounded p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Recent Job Postings</h3>
                  <p className="text-sm text-gray-500">
                    Your latest job postings
                  </p>
                </div>
                <button
                  className="text-sm text-blue-600 hover:text-blue-500 hover:cursor-pointer"
                  onClick={() => navigate("/company/jobs")}
                >
                  View All
                </button>
              </div>

              {loadingJobs ? (
                    <div className="flex justify-center items-center h-full py-6">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
              ) : recentJobs.length === 0 ? (
                <p className="text-sm text-gray-500">No recent job postings</p>
              ) : (
                <div className="flex flex-col gap-2 h-80 overflow-y-auto">
                  {recentJobs.map((j) => (
                    <div
                      key={j.id}
                      className="flex justify-between border border-black/10 rounded px-4 py-3"
                    >
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="font-semibold">{j.title}</div>
                        <div className="flex gap-2 items-center text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FiMapPin /> {j.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiCalendar />{" "}
                            {new Date(j.deadline as string).getDate()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col gap-2 text-xs">
                        <div className="flex gap-3">
                          <span className="px-2 py-1 rounded-sm shadow-xs bg-blue-100 text-blue-700 border border-blue-500/30">
                            {j.status}
                          </span>
                          <span className="px-2 py-1 rounded-sm shadow-xs bg-gray-100 text-gray-700 border border-gray-500/30">
                            {j.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white border border-black/10 rounded p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Recent Applications</h3>
                  <p className="text-sm text-gray-500">
                    Latest applications for your jobs
                  </p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-500 hover:cursor-pointer">View All</button>
              </div>
              <div className="flex flex-col gap-2 h-80 overflow-y-auto">
                {loadingApplications ? (
                      <div className="flex justify-center items-center h-full py-6">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : jobApplications.length === 0 ? (
                  <p className="text-sm text-gray-500">No applications yet</p>
                ) : (
                  recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="border border-black/10 rounded p-4 flex items-start justify-between"
                    >
                      <div>
                        <div className="font-semibold">{app.student?.name}</div>
                        <div className="text-sm text-gray-500">
                          {app.student?.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Applied for: {app.job?.title}
                        </div>
                        <div className="text-gray-500 flex items-center gap-1 text-xs mt-1">
                          <FiCalendar /> {app.createdAt}
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-sm shadow-xs text-xs border
                          ${
                            app.status === "SHORTLISTED"
                              ? "bg-green-100 text-green-700 border-green-500/30"
                              : "bg-gray-100 text-gray-700 border-gray-500/30"
                          }
                        `}
                      >
                        {app.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  titleCss,
  value,
  boxCss,
}: {
  title: string;
  titleCss: string;
  value: number;
  boxCss: string;
}) {
  return (
    <div className={boxCss}>
      <div className={titleCss}>{title}</div>
      <div className={`text-2xl font-semibold ${titleCss}`}>{value}</div>
    </div>
  );
}
