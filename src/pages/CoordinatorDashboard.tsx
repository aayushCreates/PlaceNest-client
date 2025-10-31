import {
  FiUsers,
  FiCheckCircle,
  FiClipboard,
  FiBriefcase,
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { StudentProfile } from "../types/student.types";
import type { Company } from "../types/companies.types";

// Data Arrays for Dynamic Rendering

const getBranchWisePlacement = (students: any, branch: string)=> {
    let totalPlace = 0;
    students.map((s: any)=> {
      if(s.branch === branch && s.isPlaced == true) {
        totalPlace++;
      }
    });

    return totalPlace;
}

const getBranchWiseStudents = (students: any, branch: string)=> {
  let totalStudents = 0;
  students.map((s: any)=> {
    if(s.branch === branch) {
      totalStudents++;
    }
  });

  return totalStudents;
}

export default function CoordinatorDashboard() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalActiveJobs, setTotalActiveJobs] = useState<number>(0);
  const [totalStudentPlaced, setTotalStudentPlaced] = useState<number>(0);
  const [pendingStudentVerifications, setPendingStudentsVerifications] = useState<number>(0);
  const [pendingCompanyVerifications, setPendingCompanyVerifications] = useState<number>(0);

  const pendingActions = [
    {
      heading: "Student Verifications",
      data: `${pendingStudentVerifications} students pending verification`,
      buttonText: "Review",
      buttonCss:
        "bg-blue-500 text-white text-sm px-3 py-1 rounded-sm hover:bg-blue-600",
      boxCss:
        "flex justify-between items-center rounded-sm p-3 bg-blue-300/10 border border-blue-500/40",
    },
    // {
    //   heading: "Job Approvals",
    //   data: "2 job postings pending approval",
    //   buttonText: "Review",
    //   buttonCss:
    //     "bg-blue-500 text-white text-sm px-3 py-1 rounded-sm hover:bg-blue-600",
    //   boxCss:
    //     "flex justify-between items-center rounded-sm p-3 bg-blue-300/10 border border-blue-500/40",
    // },
    {
      heading: "Company Verifications",
      data: `${pendingCompanyVerifications} company pending verification`,
      buttonText: "Review",
      buttonCss:
        "bg-green-500 text-white text-sm px-3 py-1 rounded-sm hover:bg-green-600",
      boxCss:
        "flex justify-between items-center rounded-sm p-3 bg-green-300/10 border border-green-500/40",
    },
  ];
  const stats = [
    {
      icon: <FiUsers className="text-2xl" />,
      count: students.length,
      title: "Total Students",
      titleColor: "text-blue-600",
      iconColor: "text-blue-600",
      boxCss: "border border-blue-600/30",
    },
    {
      icon: <FiBriefcase className="text-2xl" />,
      count: companies.length,
      title: "Registered Companies",
      titleColor: "text-gray-600",
      iconColor: "text-gray-600",
      boxCss: "border border-gray-600/30",
    },
    {
      icon: <FiClipboard className="text-2xl" />,
      count: totalActiveJobs,
      title: "Active Job Openings",
      titleColor: "text-yellow-600",
      iconColor: "text-yellow-600",
      boxCss: "border border-yellow-600/30",
    },
    {
      icon: <FiCheckCircle className="text-2xl" />,
      count: totalStudentPlaced,
      title: "Students Placed",
      titleColor: "text-green-600",
      iconColor: "text-green-600",
      boxCss: "border border-green-600/30",
    },
  ];
  const departments = [
    { 
      dep: "Computer Science Engineering", 
      total: getBranchWiseStudents(students, "CSE"), 
      placed: getBranchWisePlacement(students, "CSE"), 
      pct: (getBranchWisePlacement(students, "CSE")/getBranchWiseStudents(students, "CSE"))*100 
    },
    { dep: "Electronics and Communication Engineering", 
      total: getBranchWiseStudents(students, "ECE"), 
      placed: getBranchWisePlacement(students, "ECE"), 
      pct: (getBranchWisePlacement(students, "ECE")/getBranchWiseStudents(students, "ECE"))*100 },
    { dep: "Mechanical Engineering", 
      total: getBranchWiseStudents(students, "ME"), 
      placed: getBranchWisePlacement(students, "ME"), 
      pct: (getBranchWisePlacement(students, "ME")/getBranchWiseStudents(students, "ME"))*100 },
    { dep: "Civil Engineering", 
      total: getBranchWiseStudents(students, "CE"), 
      placed: getBranchWisePlacement(students, "CE"), 
      pct: (getBranchWisePlacement(students, "CE")/getBranchWiseStudents(students, "CE"))*100 },
    { dep: "Cybersecurity", 
      total: getBranchWiseStudents(students, "CY"), 
      placed: getBranchWisePlacement(students, "CY"), 
      pct: (getBranchWisePlacement(students, "CY")/getBranchWiseStudents(students, "CY"))*100 },
    { dep: "Electronics and Instrumental Control Engineering", 
      total: getBranchWiseStudents(students, "EIC"), 
      placed: getBranchWisePlacement(students, "EIC"), 
      pct: (getBranchWisePlacement(students, "EIC")/getBranchWiseStudents(students, "EIC"))*100 },
  ];

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data.data: ", response.data.data);

        let activeJobs = 0;
        response.data.data.map((j: any)=> {
          if(j.status === "ACTIVE") { 
            activeJobs++;
          }
        })
        setTotalActiveJobs(activeJobs);
    } catch (err) {
      toast.error("Error in fetching jobs");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/profile/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

        setStudents(response.data.data);

        let totalPlacedStudents = 0;
        let totalUnVerifiedProfiles = 0;
        response.data.data.map((s: any)=> {
          if(s.isPlaced) {
            totalPlacedStudents++;
          }
          if(!s.verifiedProfile) {
            totalUnVerifiedProfiles++;
          }
        })

        setTotalStudentPlaced(totalPlacedStudents);
        setPendingStudentsVerifications(totalUnVerifiedProfiles);
    } catch (err) {
      toast.error("Error in fetching jobs");
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/profile/company`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompanies(response.data.data);

      let pendingCompany = 0;
      response.data.data.map((c: any)=> {
        if (!c.verifiedProfile) {
          pendingCompany++;
        }
      })
      setPendingCompanyVerifications(pendingCompany);
    } catch (err) {
      toast.error("Error in fetching jobs");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchJobs();
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-gray-700">
      <SideBar />

      <main className="flex-1 p-8 pl-72">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Placement Dashboard</h2>
          <p className="text-sm text-gray-400">
            Overview of placement activities and statistics
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 my-6">
          {stats.map(
            ({ icon, count, title, titleColor, iconColor, boxCss }) => (
              <div
                key={title}
                className={`flex items-center justify-between min-w-[200px] flex-1 bg-white rounded-md p-4 shadow-xs ${boxCss}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${iconColor}`}>{icon}</div>
                  <div>
                    <p className={`${titleColor}`}>{title}</p>
                  </div>
                </div>
                <p className={`font-semibold text-lg ${titleColor}`}>{count}</p>
              </div>
            )
          )}
        </div>

        {/* Pending Actions & Recent Activities */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Pending Actions */}
          <div className="flex-1 bg-white border border-gray-200 rounded-md p-4">
            <h3 className="font-semibold mb-3">Pending Actions</h3>
            <p className="text-gray-400 text-xs mb-4">
              Items requiring your attention
            </p>
            <div className="space-y-3">
              {pendingActions.map(
                ({ heading, data, buttonText, buttonCss, boxCss }) => (
                  <div key={heading} className={boxCss}>
                    <div>
                      <p className="font-semibold text-sm">{heading}</p>
                      <p className="text-xs text-gray-600">{data}</p>
                    </div>
                    <button className={buttonCss}>{buttonText}</button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recent Activities */}
          {/* <div className="flex-1 bg-white border border-gray-200 rounded-md p-4">
            <h3 className="font-semibold mb-3">Recent Activities</h3>
            <p className="text-gray-400 text-xs mb-4">
              Latest platform activities
            </p>
            <ul className="space-y-3">
              {recentActivities.map(({ icon, description, time }) => (
                <li
                  key={description}
                  className="flex gap-3 items-center text-sm bg-gray-100/10 py-2 px-3 rounded-sm border border-black/10"
                >
                  {icon}
                  <div>
                    <p className="font-semibold">{description}</p>
                    <p className="text-gray-400 text-xs">{time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Department-wise Placement Statistics */}
        <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
          <h3 className="font-semibold mb-3">
            Department-wise Placement Statistics
          </h3>
          <p className="text-gray-400 text-xs mb-6">
            Placement performance by department
          </p>
          <div className="space-y-4">
            {departments.map(({ dep, total, placed, pct }) => (
              <div key={dep} className="flex justify-between items-center border border-black/10 px-3 py-2 rounded-sm bg-gray-100/20">
                <div>
                  <p className="font-semibold">{dep}</p>
                  <p className="text-xs text-gray-500">
                    {total} students &bull; {placed} placed
                  </p>
                </div>
                <div className="flex items-center gap-2 w-48">
                  <p className="text-xs text-gray-500">{pct}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
