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
import LinkedinPosts from "./pages/LinkedinPosts";

const PublicOnlyRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Outlet />;
  }

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

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if role doesn't match
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
  }

  return <Outlet />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">Initializing PlaceNest...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/other-jobs" element={<OtherJobs />} />
        <Route path="/linkedin-posts" element={<LinkedinPosts />} />
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/jobs" element={<StudentJobs />} />
        <Route path="/student/job/:id" element={<JobDetails />} />
        <Route path="/student/resume-review" element={<ResumeAssistant />} />
      </Route>

      {/* Company Routes */}
      <Route element={<ProtectedRoute allowedRoles={["COMPANY"]} />}>
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route
          path="/company/students-applications"
          element={<StudentJobApplications />}
        />
        <Route path="/company/post-job" element={<PostJob />} />
        <Route path="/company/manage-jobs" element={<ManageJobs />} />
      </Route>

      {/* Coordinator Routes */}
      <Route element={<ProtectedRoute allowedRoles={["COORDINATOR"]} />}>
        <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
        <Route
          path="/coordinator/manage-students"
          element={<StudentManagement />}
        />
        <Route
          path="/coordinator/manage-companies"
          element={<ManageCompanies />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
