import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import ManageJobs from "./pages/Employer/ManageJobs";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import LandingPage from "./pages/LandingPage/LangdingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyResetCode from "./pages/Auth/VerifyResetCode";
import ResetPassword from "./pages/Auth/ResetPassword";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import CompanyProfilePage from "./pages/Employer/EmployerProfilePage";
import EditProfileDetails from "./pages/Employer/EditProfileDetails";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <AuthProvider>
        {" "}
        {/* Wrap your app with AuthProvider */}
        <Router>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-code" element={<VerifyResetCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/find-jobs" element={<JobSeekerDashboard />} />
            <Route path="/job/:jobId" element={<JobDetails />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Protected routes */}

            <Route element={<ProtectedRoute requiredRole="employer" />}>
              <Route path="/post-job" element={<JobPostingForm />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
              <Route
                path="/employer-dashboard"
                element={<EmployerDashboard />}
              />
              <Route path="/applicants" element={<ApplicationViewer />} />
              <Route path="/company-profile" element={<CompanyProfilePage />} />
              <Route
                path="/edit-company-profile"
                element={<EditProfileDetails />}
              />
            </Route>

            {/* catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </AuthProvider>
    </div>
  );
}

export default App;
