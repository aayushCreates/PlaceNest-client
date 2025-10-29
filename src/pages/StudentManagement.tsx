import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiX,
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { toast } from "sonner";
import axios from "axios";
import type { StudentVerification } from "../types/student.types";

const filters = [
  {
    label: "All Status",
    options: ["All Status", "Verified", "Pending"],
  },
  {
    label: "All Departments",
    options: ["All Departments", "Computer Science", "Electronics"],
  },
];

export default function StudentManagement() {
  const [studentVerifyApplications, setStudentVerifyApplications] = useState<
    StudentVerification[]
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentVerification | null>(null); // ✅ NEW
  const [totalVerifiedStudents, setTotalVerifiedStudents] = useState<number>(0);
  const [totalPendingStudents, setTotalPendingStudents] = useState<number>(0);
  const [totalRejectedStudents, setTotalRejectedStudents] = useState<number>(0);
  const token = localStorage.getItem("token");

  const stats = [
    {
      label: "Total Students",
      value: studentVerifyApplications.length,
      icon: <FiUser className="text-2xl text-blue-500" />,
      boxCss: "border border-blue-500/40 rounded-md p-4 text-center",
      textCss: "text-blue-500",
    },
    {
      label: "Verified Students",
      value: totalVerifiedStudents,
      icon: <FiCheckCircle className="text-2xl text-gray-800" />,
      boxCss: "border border-black/20 rounded-md p-4 text-center",
      textCss: "text-gray-800",
    },
    {
      label: "Pending Students",
      value: totalPendingStudents,
      icon: <FiXCircle className="text-2xl text-yellow-500" />,
      boxCss: "border border-yellow-500/40 rounded-md p-4 text-center",
      textCss: "text-yellow-500",
    },
    {
      label: "Rejected Students",
      value: totalRejectedStudents,
      icon: <FiBookOpen className="text-2xl text-red-500" />,
      boxCss: "border border-red-500/40 rounded-md p-4 text-center",
      textCss: "text-red-500",
    },
  ];

  const fetchStudentVerficationApplication = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/verification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const studentProfiles: StudentVerification[] = [];
      response.data.data.map((s: any) => {
        s.role === "STUDENT" && studentProfiles.push(s);
      });

      setStudentVerifyApplications(studentProfiles);

      let pending = 0;
      let verified = 0;
      let rejected = 0;

      studentProfiles.map((a) => {
        if (a.verificationStatus === "PENDING") pending++;
        else if (a.verificationStatus === "APPROVED") verified++;
        else rejected++;
      });
      setTotalPendingStudents(pending);
      setTotalVerifiedStudents(verified);
      setTotalRejectedStudents(rejected);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(
          err.response.data?.message ||
            "Error in fetching the student verification application"
        );
      } else {
        toast.error("Error in fetching the student verification application");
      }
    }
  };

  useEffect(() => {
    fetchStudentVerficationApplication();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-700 font-sans relative">
      <SideBar />

      <main className="flex-1 p-8 lg:pl-72">
        <section className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Management
            </h1>
            <p className="text-gray-500 mt-1">
              Verify and manage student profiles
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className={stat.boxCss}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center mb-1">
                      {stat.icon}
                    </div>
                    <p className={`${stat.textCss}`}>{stat.label}</p>
                  </div>
                  <p className={`${stat.textCss} text-xl font-semibold`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="rounded-md p-4 flex items-center justify-between">
            <div className="flex justify-between w-full">
              <div className="flex items-center border border-black/20 rounded-md px-3 py-2 flex-grow max-w-md">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="outline-none w-full text-sm"
                />
              </div>
              <div className="flex gap-3">
                {filters.map((filter, index) => (
                  <select
                    key={index}
                    className="border border-black/20 rounded-md px-3 py-2 text-sm text-gray-700"
                  >
                    {filter.options.map((option, idx) => (
                      <option key={idx}>{option}</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          </div>

          {/* Student Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studentVerifyApplications.map((s) => (
              <div
                key={s.id}
                className="border border-black/10 rounded-md p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <p className="text-sm text-gray-500">{s.id}</p>
                  </div>
                  <span
                    className={`ml-auto px-3 py-1 text-xs font-semibold rounded-sm shadow-xs ${
                      s.verificationStatus === "APPROVED"
                        ? "bg-blue-50 text-blue-600 border border-blue-600/10"
                        : s.verificationStatus === "PENDING"
                        ? "bg-gray-50 text-gray-600 border border-black/10"
                        : "bg-red-50 text-red-600 border border-red-600/10"
                    }`}
                  >
                    {s.verificationStatus}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <FiMail /> {s.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone /> {s.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiBookOpen /> {s.branch}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiCalendar /> {s.year} YEAR
                  </p>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setSelectedStudent(s)} // ✅ open modal
                    className="flex-1 border border-black/10 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50 text-sm hover:cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M12 4h9" />
                      <path d="M4 12h16" />
                    </svg>
                    View Profile
                  </button>

                  {s.verificationStatus === "APPROVED" ? (
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
        </section>
      </main>

      {/* ✅ Profile Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-md shadow-lg p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <FiUser className="text-3xl text-gray-600" />
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                {selectedStudent.name}
              </h2>
              
              <p className="text-sm text-gray-500">{selectedStudent.email}</p>
              <p
                className={`px-3 py-1 rounded-sm shadow-xs text-xs font-semibold ${
                  selectedStudent.verificationStatus === "APPROVED"
                    ? "bg-blue-100 text-blue-600 border border-blue-500/10"
                    : selectedStudent.verificationStatus === "PENDING"
                    ? "bg-gray-100 text-gray-600 border border-gray-500/10"
                    : "bg-red-100 text-red-600 border border-red-500/10"
                }`}
              >
                {selectedStudent.verificationStatus}
              </p>

              <div className="w-full mt-4 space-y-2 text-sm text-gray-700">

                <p className="flex justify-between  border px-3 py-2 bg-gray-50 rounded-sm border-black/10">
                  <span className="font-medium">Phone:</span>{" "}
                  <span>{selectedStudent.phone}</span>
                </p>

                <p className="flex justify-between  border px-3 py-2 bg-gray-50 rounded-sm border-black/10">
                  <span className="font-medium">Branch:</span>{" "}
                  <span>{selectedStudent.branch}</span>
                </p>

                <p className="flex justify-between  border px-3 py-2 bg-gray-50 rounded-sm border-black/10">
                  <span className="font-medium">Year:</span>{" "}
                  <span>{selectedStudent.year}</span>
                </p>

                <p className="flex justify-between border px-3 py-2 bg-gray-50 rounded-sm border-black/10">
                  <span className="font-medium">Student ID:</span>{" "}
                  <span>{selectedStudent.id}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
