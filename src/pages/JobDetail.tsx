import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import type { Job } from "../types/job.types";
import { toast } from "sonner";
import type { Application } from "../types/application.types";

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`px-3 py-1 border border-black/10 rounded-md text-sm text-gray-600 ${className}`}
  >
    {children}
  </span>
);

const InfoBlock = ({
  icon: Icon,
  title,
  children,
  iconColor = "text-gray-600",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconColor?: string;
}) => (
  <div className="bg-white p-6 rounded-md shadow-xs border border-black/10">
    <h2 className="text-md font-semibold mb-2 flex items-center">
      <Icon className={`mr-2 ${iconColor}`} />
      {title}
    </h2>
    {children}
  </div>
);

export default function JobDetails() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [jobDetail, setJobsDetail] = useState<Job>();
  const [applicationDetails, setApplicationDetails] = useState<Application>();
  const [jobLoading, setJobLoading] = useState(true);
const [applicationLoading, setApplicationLoading] = useState(true);

  const { id } = useParams();

  const fetchJobDetail = async () => {
    setJobLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setJobsDetail(response.data.data);
      }
    } catch (err) {
      toast.error("Error in fetching jobs");
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setApplicationDetails(response.data.data);
      }
    } catch (err) {
      toast.error("Error in fetching application");
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleApply = async ()=> {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/job/${id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setApplicationDetails(response.data.data);
        toast.success("Job Applied Successfully");
      }
    } catch(err) {
      toast.error("Error in apply job");
    }
  }

  useEffect(() => {
    fetchJobDetail();
    myApplicationDetails();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side bar */}
      <SideBar />

      {/* Body */}
      {
        (!jobLoading && !applicationLoading) ? (
          <main className="flex-1 pl-72 p-8">
        <div className="max-w-6xl mx-auto py-6 px-4">
          {/* Back Button */}
          <button
            className="flex items-center text-gray-600 mb-4 hover:bg-gray-300/20 px-2 py-1 rounded-sm hover:cursor-pointer"
            onClick={() => navigate("/student/jobs")}
          >
            <FiArrowLeft className="mr-2" /> Back to Jobs
          </button>

          {/* Job Header */}
          <div className="bg-white p-6 rounded-md shadow-xs border border-black/10 mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold">{jobDetail?.title}</h1>
                  <p className="flex items-center text-gray-600 mt-1">
                    <FiBriefcase className="mr-2" /> {jobDetail?.company?.name}
                  </p>
                  <div className="flex flex-wrap gap-6 text-gray-500 mt-3">
                    <span className="flex items-center">
                      <FiMapPin className="mr-1" /> {jobDetail?.location}
                    </span>
                    <span>₹{jobDetail?.salary}</span>
                    <span className="flex items-center">
                      <FiClock className="mr-1" /> Posted {jobDetail?.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Deadline {jobDetail?.deadline}
                  </p>
                </div>

                <div className="flex gap-3 text-right">
                  <Badge className="bg-blue-100 !text-blue-500 font-medium rounded-sm">
                    {jobDetail?.type}
                  </Badge>
                  <Badge className="bg-green-100 text-green-600 flex items-center font-medium rounded-sm">
                    <FiCheckCircle className="mr-1" /> {jobDetail?.status}
                  </Badge>
                </div>
              </div>
              {!applicationDetails && (
                <button className="bg-blue-500 !text-white font-medium rounded-sm px-3 py-1.5 shadow-xs hover:cursor-pointer"
                onClick={handleApply}>
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 col-span-2">
              <InfoBlock icon={FiBriefcase} title=" Description">
                <p className="text-gray-600 text-sm">
                  {jobDetail?.description}
                </p>
              </InfoBlock>

              {/* <InfoBlock icon={FiCheckCircle} title="Requirements">
                <div className="flex flex-wrap gap-3">
                  {jobDetail?.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </InfoBlock> */}

              <InfoBlock icon={FiBriefcase} title="Eligible Departments">
                <div className="flex flex-wrap gap-3">
                  {jobDetail?.branchCutOff.map((dept) => (
                    <Badge key={dept}>{dept}</Badge>
                  ))}
                </div>
              </InfoBlock>

              {/* <InfoBlock icon={FiClock} title="Eligible Graduation Years">
                <div className="flex flex-wrap gap-3">
                  {jobDetail?.graduationYears.map((year) => (
                    <Badge key={year}>{year}</Badge>
                  ))}
                </div>
              </InfoBlock> */}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {applicationDetails && (
                <InfoBlock
                  icon={FiCheckCircle}
                  title="Application Status"
                  iconColor="text-green-600"
                >
                  <p className="text-green-600 font-medium mb-1">
                    {applicationDetails?.status}
                  </p>
                  {/* <p className="text-gray-500 text-sm">{applicationDetails?.applicationNote}</p> */}
                </InfoBlock>
              )}

              <InfoBlock
                icon={FiInfo}
                title="About Company"
                iconColor="text-blue-600"
              >
                <p className="font-medium">{jobDetail?.company?.name}</p>
                <p className="text-gray-500 text-sm mb-3">Technology Company</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Industry:</span>{" "}
                    {jobDetail?.company?.industry}
                  </p>
                  <p>
                    <span className="font-medium">Website:</span>{" "}
                    {jobDetail?.company?.website}
                  </p>
                  {/* <p>
                    <span className="font-medium">Founded:</span>{" "}
                    {jobDetail?.company?.founded}
                  </p> */}
                </div>
              </InfoBlock>

              <InfoBlock
                icon={FiBriefcase}
                title="Application Stats"
                iconColor="text-purple-600"
              >
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Total Applications:</span>{" "}
                    {jobDetail?.applications?.length} Applications
                  </p>
                  {/* <p>
                    <span className="font-medium">Positions Available:</span>{" "}
                    {jobDetail?.}
                  </p> */}
                  <p>
                    <span className="font-medium">Application Status:</span>{" "}
                    <span
                      className={`font-medium ${
                        applicationDetails?.status
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {applicationDetails && applicationDetails.status
                        ? applicationDetails?.status
                        : "Not Available"}
                    </span>
                  </p>
                </div>
              </InfoBlock>
            </div>
          </div>
        </div>
      </main>
        ) : (
          <div className="flex min-h-screen w-full pl-72 p-8 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          </div>
        </div>
        )
      }
    </div>
  );
}
