import {
    FiSearch,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiBriefcase,
    FiMapPin,
    FiCalendar,
  } from "react-icons/fi";
  import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import type { Job } from "../types/job.types";
import { toast } from "sonner";
import axios from "axios";
  
  const statsData = [
    {
      label: "Total Jobs",
      count: 4,
      icon: <FiCheckCircle className="text-blue-600 h-8 w-8" />,
      boxCss: "bg-blue-400/10 border border-blue-500/20 p-4 rounded-lg shadow flex items-center gap-3",
      labelColor: "text-blue-500"
    },
    {
      label: "Active Jobs",
      count: 4,
      icon: <FiBriefcase className="text-green-600 h-8 w-8" />,
      boxCss: "bg-green-400/10 border border-green-500/20 p-4 rounded-lg shadow flex items-center gap-3",
      labelColor: "text-green-500"
    },
    {
      label: "Pending Review",
      count: 0,
      icon: <FiClock className="text-yellow-600 h-8 w-8" />,
      boxCss: "bg-yellow-400/10 border border-yellow-500/20 p-4 rounded-lg shadow flex items-center gap-3",
      labelColor: "text-yellow-500"
    },
    {
      label: "Closed Jobs",
      count: 0,
      icon: <FiXCircle className="text-red-600 h-8 w-8" />,
      boxCss: "bg-red-400/10 border border-red-500/20 p-4 rounded-lg shadow flex items-center gap-3",
      labelColor: "text-red-500"
    },
  ];

  
  const JobManagement = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const token = localStorage.getItem("token")

    const fetchJobs = async ()=> {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/job/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if(Array.isArray(response.data.data)){
          setJobs(response.data.data);
        }
      } catch(err){
        toast.error("Error in fetching jobs");
      }
    }

    useEffect(()=> {
      fetchJobs();
    }, []);

    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideBar />
  
        {/* Main Content */}
        <main className="flex-1 p-6 pl-72">
          {/* Job Management Header */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Job Management
          </h1>
          <p className="text-gray-500 mb-6">
            Review and manage job postings
          </p>
  
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {statsData.map((s, i) => (
              <div
                key={i}
                className={`${s.boxCss}`}
              >
                {s.icon}
                <div className="flex gap-3 items-center">
                  <p className={`text-md font-semibold ${s.labelColor}`}>{s.label}</p>
                  <p className={`text-lg font-bold ${s.labelColor}`}>{s.count}</p>
                </div>
              </div>
            ))}
          </div>
  
          {/* Filters */}
          <div className="bg-white border border-black/10 p-4 rounded-md shadow-xs mb-6 flex items-center justify-between">
            <div className="flex items-center border border-black/20 rounded px-3 py-2 w-1/3">
              <FiSearch size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="ml-2 w-full outline-none text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select className="border border-black/20 rounded px-3 py-2 text-sm">
                <option>All Status</option>
              </select>
              <select className="border border-black/20 rounded px-3 py-2 text-sm">
                <option>All Companies</option>
              </select>
            </div>
          </div>
  
          {/* Job Cards */}
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div
                key={i}
                className="bg-white border border-black/10 p-5 rounded-md shadow-xs flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <p className="text-gray-500 text-sm">{job.company?.name}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 text-xs font-medium rounded-sm shadow-xs">
                    {job.status}
                  </span>
                </div>
  
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FiMapPin size={16} /> {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={16} /> Posted {job.createdAt}
                  </div>
                </div>
  
                {/* Tags */}
                {/* <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs border border-black/10 bg-neutral-100 rounded-sm shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div> */}
  
                <p className="text-sm text-gray-600">
                  Join our team to build next-generation web applications...
                </p>
  
                <div className="flex justify-between items-center pt-2">
                  {/* <p className="text-sm text-gray-500">
                    {job.applications} application
                    {job.applications !== 1 ? "s" : ""}
                  </p> */}
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm border border-black/10 rounded hover:bg-gray-50 hover:cursor-pointer">
                      View Details
                    </button>
                    <button className="px-4 py-2 text-sm border border-red-500/20 bg-red-300/10 text-red-500 rounded hover:bg-red-600/10 hover:cursor-pointer">
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  };
  
  export default JobManagement;
  