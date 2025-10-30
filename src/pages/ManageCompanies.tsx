import React, { useEffect, useState } from "react";
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
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import type { Company } from "../types/companies.types";
import axios from "axios";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";
import { TbBuildingSkyscraper } from "react-icons/tb";

const industries = [
  "All Industries",
  "Software Development",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

const status = ["All Status", "Pending", "Approved", "Rejected"];

const ManageCompanies: React.FC = () => {
  const [companiesProfiles, setCompaniesProfiles] = useState<Company[]>([]);
  const [totalCompaniesProfiles, setTotalCompaniesProfiles] = useState<
    Company[]
  >([]);
  const [totalVerifiedCompanies, setTotalVerifiedComanies] =
    useState<number>(0);
  const [totalPendingJobs, setTotalPendingJobs] = useState<number>(0);
  const [totalActiveJobs, setTotalActiveJobs] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [selectedIndustry, setSelectedIndustry] =
    useState<string>("All Industries");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const token = localStorage.getItem("token");

  const stats = [
    {
      heading: "Total Companies",
      data: companiesProfiles.length,
      icon: <FiBriefcase className="h-6 w-6 text-gray-600" />,
      boxCss:
        "border border-gray-500/20 bg-gray-50/40 rounded-md shadow-xs p-4 flex items-center gap-3",
      contentCss: "text-gray-700",
    },
    {
      heading: "Verified Companies",
      data: totalVerifiedCompanies,
      icon: <FiCheckCircle className="h-6 w-6 text-blue-500" />,
      boxCss:
        "border border-blue-200 rounded-md bg-blue-50 shadow-xs p-4 flex items-center gap-3",
      contentCss: "text-blue-600",
    },
    {
      heading: "Pending Jobs",
      data: totalPendingJobs,
      icon: <FiClock className="h-6 w-6 text-red-500" />,
      boxCss:
        "border border-red-200 rounded-md bg-red-50 shadow-xs p-4 flex items-center gap-3",
      contentCss: "text-red-600",
    },
    {
      heading: "Active Jobs",
      data: totalActiveJobs,
      icon: <FiHome className="h-6 w-6 text-green-500" />,
      boxCss:
        "border border-green-200 rounded-md bg-green-50 shadow-xs p-4 flex items-center gap-3",
      contentCss: "text-green-600",
    },
  ];

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/verification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const companiesProfiles: Company[] = [];
      response.data.data.map((c: any) => {
        c.role === "COMPANY" && companiesProfiles.push(c);
      });

      setCompaniesProfiles(companiesProfiles);
      setTotalCompaniesProfiles(companiesProfiles);

      let pendingJobs = 0;
      let verifiedCompanies = 0;
      let activeJobs = 0;

      companiesProfiles.map((p) => {
        if (p.verificationStatus === "APPROVED") {
          verifiedCompanies++;
        } else if (p.verificationStatus === "PENDING") {
          pendingJobs++;
        } else {
          activeJobs++;
        }
      });
      setTotalActiveJobs(activeJobs);
      setTotalPendingJobs(pendingJobs);
      setTotalVerifiedComanies(verifiedCompanies);
    } catch (err) {
      toast.error("Error in fetching the company verification data");
    }
  };

  const handleSearch = (input: string) => {
    if (input.trim() !== "") {
      const lowerInput = input.toLowerCase();
      setCompaniesProfiles(
        totalCompaniesProfiles.filter((c) =>
          c.name.toLowerCase().includes(lowerInput)
        )
      );
    } else {
      setCompaniesProfiles(totalCompaniesProfiles);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Close modal with ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCompany(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-8 pl-72">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Company Management
        </h1>
        <p className="text-gray-500 mb-8">Verify and manage company profiles</p>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((s, idx) => (
            <div key={idx} className={s.boxCss}>
              {s.icon}
              <div className="flex items-center justify-between w-full">
                <span className={`text-md font-semibold ${s.contentCss}`}>
                  {s.heading}
                </span>
                <span className={`${s.contentCss} text-lg font-semibold`}>
                  {s.data}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Filters */}
        <div className="p-4 rounded-md shadow-xs mb-8 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="border border-gray-300 rounded-md px-3 py-2 w-1/3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {status.map((i, idx) => (
                <option key={idx}>{i}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              {industries.map((i, idx) => (
                <option key={idx}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesProfiles.map((company, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-md border border-black/10 shadow-xs"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-600/10 flex items-center justify-center font-bold text-sm text-blue-500">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {company.name}
                    </h2>
                    <p className="text-sm text-gray-500">{company.industry}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-sm ${
                    company.verificationStatus.toLowerCase() === "approved"
                      ? "bg-green-50 text-green-600 border border-green-500/20"
                      : company.verificationStatus.toLowerCase() === "pending"
                        ? "bg-gray-50 text-gray-600 border border-gray-500/20"
                        : "bg-red-50 text-red-600 border border-red-500/20"
                  }`}
                >
                  {company.verificationStatus}
                </span>
              </div>

              {/* Info */}
              <div className="text-sm text-gray-600 space-y-2 mb-3">
                <p className="flex items-center gap-2">
                  <FiMail size={14} /> {company.email}
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone size={14} /> {company.phone}
                </p>
                <p className="flex items-center gap-2">
                  <FiMapPin size={14} /> {company.location}
                </p>
                <p className="flex items-center gap-2">
                  <FiBriefcase size={14} /> {company.website}
                </p>
                <p className="flex items-center gap-2">
                  <FiCalendar size={14} /> {company.founded}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mb-4">
                {company.description}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 border border-black/10 rounded-sm py-2 flex items-center justify-center gap-1 bg-gray-50 text-sm hover:cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedCompany(company)}
                >
                  <TbBuildingSkyscraper className="h-5 w-5" />
                  View Profile
                </button>
                {company.verificationStatus === "APPROVED" ? (
                  <button className="border border-red-500/10 rounded-sm py-2 px-4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-sm text-white hover:cursor-pointer">
                    <FiXCircle />
                    Revoke
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button className="border border-green-500/40 bg-green-300/10 hover:bg-green-400/10 hover:cursor-pointer text-white rounded-sm py-2 px-2 flex items-center justify-center gap-2 text-sm">
                      <FiCheckCircle className="text-green-500" />
                      <span className="text-green-500">Accept</span>
                    </button>
                    <button className="border border-red-500/40 bg-red-300/10 hover:bg-red-400/10 hover:cursor-pointer text-white rounded-sm py-2 px-2 flex items-center justify-center gap-2 text-sm">
                      <FiXCircle className="text-red-500" />
                      <span className="text-red-500">Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- Modal for View Profile --- */}
        {selectedCompany && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedCompany(null)}
          >
            <div
              className="bg-white rounded-lg shadow-md w-full max-w-lg relative mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Company Profile
                </h2>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-gray-500 hover:text-gray-700 transition hover:cursor-pointer"
                  aria-label="Close profile"
                >
                  <IoMdClose size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between text-center bg-gray-50/50 border-b-0 px-3 py-2 border border-black/10 rounded-sm rounded-bl-none rounded-br-none">
                  <div className="flex flex-col w-3/4 items-start">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedCompany.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedCompany.industry}
                    </p>
                    <span
                      className={`px-2 py-0.5 mt-2 text-xs font-medium rounded-sm shadow-xs ${
                        selectedCompany.verificationStatus === "APPROVED"
                          ? "bg-green-50 text-green-500 border border-green-500/10"
                          : selectedCompany.verificationStatus === "PENDING"
                            ? "bg-yellow-50 text-yellow-500 border border-yellow-500/20"
                            : "bg-red-50 text-red-500 border border-red-500/10"
                      }`}
                    >
                      {selectedCompany.verificationStatus}
                    </span>
                  </div>

                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-inner font-bold text-blue-700 text-xl">
                    {selectedCompany.name.charAt(0)}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 text-sm text-gray-700 border border-black/10 border-t-0 px-3 py-2 bg-gray-50/50 rounded-sm rounded-tl-none rounded-tr-none">
                  <div className="flex justify-between items-center px-3 py-2 rounded-sm bg-white border border-black/10">
                    <span className="font-medium flex items-center gap-1">
                      <FiMail size={14} /> Email:
                    </span>
                    <span>{selectedCompany.email || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center px-3 py-2 rounded-sm bg-white border border-black/10">
                    <span className="font-medium flex items-center gap-1">
                      <FiPhone size={14} /> Phone:
                    </span>
                    <span>{selectedCompany.phone || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center px-3 py-2 rounded-sm bg-white border border-black/10">
                    <span className="font-medium flex items-center gap-1">
                      <FiMapPin size={14} /> Location:
                    </span>
                    <span>{selectedCompany.location || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center px-3 py-2 rounded-sm bg-white border border-black/10">
                    <span className="font-medium flex items-center gap-1">
                      <FiUsers size={14} /> Company Size:
                    </span>
                    <span>{selectedCompany.length || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center px-3 py-2 rounded-sm bg-white border border-black/10">
                    <span className="font-medium flex items-center gap-1">
                      <FiBriefcase size={14} /> Website:
                    </span>
                    <span>{selectedCompany.website || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center px-3 py-2 rounded-sm bg-white border border-black/10">
                    <span className="font-medium flex items-center gap-1 ">
                      <FiCalendar size={14} /> Founded:
                    </span>
                    <span>{selectedCompany.founded || "N/A"}</span>
                  </div>

                  {/* Description */}
                  {selectedCompany.description && (
                    <div className="mt-4 border border-black/10 px-3 py-2 rounded-sm bg-white pt-3">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedCompany.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 flex justify-end">
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="px-5 py-1.5 text-sm font-medium text-gray-700 rounded-sm border border-black/10 bg-gray-100 hover:bg-gray-100 transition hover:cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageCompanies;
