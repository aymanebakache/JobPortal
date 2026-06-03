import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import JobListPage from './pages/public/JobListPage';
import JobDetailPage from './pages/public/JobDetailPage';

// Candidate Pages
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';

// Recruiter Pages
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import EditJobPage from './pages/recruiter/EditJobPage';
import ViewApplicationsPage from './pages/recruiter/ViewApplicationsPage';

// Admin Pages
import StatsPage from './pages/admin/StatsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 bg-light">
          <Navbar />
          
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />

              {/* Guarded Candidate Routes */}
              <Route 
                path="/candidate/profile" 
                element={
                  <ProtectedRoute allowedRoles={['Candidate', 'Recruiter']}>
                    <CandidateProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/candidate/applications" 
                element={
                  <ProtectedRoute allowedRoles={['Candidate']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Guarded Recruiter Routes */}
              <Route 
                path="/recruiter/jobs" 
                element={
                  <ProtectedRoute allowedRoles={['Recruiter']}>
                    <ManageJobsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/jobs/new" 
                element={
                  <ProtectedRoute allowedRoles={['Recruiter']}>
                    <CreateJobPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/jobs/:id/edit" 
                element={
                  <ProtectedRoute allowedRoles={['Recruiter']}>
                    <EditJobPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/applications/:jobId" 
                element={
                  <ProtectedRoute allowedRoles={['Recruiter']}>
                    <ViewApplicationsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Guarded Admin Routes */}
              <Route 
                path="/admin/stats" 
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <StatsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <ManageUsersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/jobs" 
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminJobsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Wildcard Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer Component */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
