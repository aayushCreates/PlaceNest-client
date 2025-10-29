import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentApplications from "./pages/StudentApplications";
import CompanyDashboard from "./pages/CompanyDashboard";
import ResumeAssistant from "./pages/ResumeAssitant";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import StudentManagement from "./pages/StudentManagement";
// import JobManagement from "./pages/JobManagement";
import ManageCompanies from "./pages/ManageCompanies";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import StudentJobs from "./pages/StudentJobs";
import JobDetails from "./pages/JobDetail";
import StudentJobApplications from "./pages/StudentJobApplications";
import Profile from "./pages/Profile";
import OtherJobs from "./pages/OtherJobs";

const PublicOnlyRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Outlet />;
  }

  console.log("user.role: ", user);

  switch (user.role) {
    case "STUDENT":
      return <Navigate to="/student/dashboard" />;
    case "COMPANY":
      return <Navigate to="/company/dashboard" />;
    case "COORDINATOR":
      return <Navigate to="/coordinator/dashboard" />;
    default:
      return <Navigate to="/" />;
  }
};

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/profile" element={<Profile />} />

      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/applications" element={<StudentApplications />} />
      <Route path="/student/jobs" element={<StudentJobs />} />
      <Route path="/student/job/:id" element={<JobDetails />} />
      <Route path="/other-jobs/" element={<OtherJobs />} />

      <Route path="/company/dashboard" element={<CompanyDashboard />} />
      <Route
        path="/company/students-applications"
        element={<StudentJobApplications />}
      />
      <Route path="/company/post-job" element={<PostJob />} />
      <Route path="/company/manage-jobs" element={<ManageJobs />} />

      <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
      <Route
        path="/coordinator/manage-students"
        element={<StudentManagement />}
      />
      {/* <Route path="/coordinator/manage-jobs" element={<JobManagement />} /> */}
      <Route
        path="/coordinator/manage-companies"
        element={<ManageCompanies />}
      />

      <Route path="/student/resume-review" element={<ResumeAssistant />} />
    </Routes>
  );
}

export default App;
