import React, { useEffect, useState } from "react";
import { FiSearch, FiMapPin, FiClock, FiFileText, FiBriefcase } from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import type { Job } from "../types/job.types";

const StudentJobs: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [initialJobData, setInitialJobData] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const branchData = ["CSE", "CY", "IT", "ME", "ECE", "EIC", "EE", "CE"];
  const jobTypes = ["Internship", "PartTime", "FullTime", "Contract"];

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data.data)) {
        setInitialJobData(response.data.data);
        setJobs(response.data.data);
      }
    } catch (err) {
      toast.error("Error in fetching jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (input: string) => {
    if (input === "") {
      setJobs(initialJobData);
    } else {
      setJobs(jobs.filter((job) => job.title === input));
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />

      <main className="flex-1 pl-72 p-8">
        <h1 className="text-2xl font-bold mb-1">Job Opportunities</h1>
        <p className="text-gray-500 mb-6">
          Discover and apply for jobs that match your profile
        </p>

        {/* Filter Bar */}
        <div className="bg-white border border-black/10 rounded-md p-4 mb-6 shadow-xs">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FiSearch /> Filter Jobs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search jobs"
              className="border border-black/20 rounded-md px-3 py-2 w-full"
              onChange={(e) => handleFilter(e.target.value)}
            />
            <select className="border border-black/20 rounded-md px-3 py-2 w-full">
              {branchData.map((b, idx) => (
                <option key={idx}>{b}</option>
              ))}
            </select>
            <select className="border border-black/20 rounded-md px-3 py-2 w-full">
              {jobTypes.map((b, idx) => (
                <option key={idx}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center mt-32">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex min-h-screen bg-gray-50">
              <SideBar />
              <main className="flex-1 pl-72 p-8 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-400">
                  No jobs available
                </h1>
              </main>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-md border border-black/10 shadow-xs transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {job.title}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                    <FiBriefcase /> 
                    {job.company?.name}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="px-3 py-1 rounded-sm font-medium bg-green-100 text-green-700">
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <FiClock /> {job.createdAt} days ago
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-gray-600 text-sm">{job.description}</p>

                {/* Tags */}
                {/* <div className="flex flex-wrap gap-2 mt-4">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div> */}

                {/* Footer */}
                <div className="flex justify-between items-center mt-5 text-sm text-gray-500 flex-wrap gap-2">
                  <div className="flex gap-6 flex-wrap">
                    <span className="flex items-center gap-1">
                      <FiMapPin /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFileText /> Deadline: {job.deadline}
                    </span>
                    <span className="font-medium">₹{job.salary}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 border border-black/10 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm hover:cursor-pointer"
                      onClick={() => navigate(`/student/job/${job.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentJobs;
