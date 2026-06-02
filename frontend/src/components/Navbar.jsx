import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-premium navbar-light sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-briefcase-fill text-primary me-2 fs-3"></i>
          <span className="fw-bold fs-4 text-primary font-heading">UniRecruit</span>
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-secondary" to="/jobs">
                <i className="bi bi-search me-1"></i> Browse Jobs
              </Link>
            </li>
            
            {/* Candidate options */}
            {user && user.role === 'Candidate' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/candidate/applications">
                    <i className="bi bi-file-earmark-check me-1"></i> My Applications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/candidate/profile">
                    <i className="bi bi-person-badge me-1"></i> My Profile
                  </Link>
                </li>
              </>
            )}

            {/* Recruiter options */}
            {user && user.role === 'Recruiter' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/recruiter/jobs">
                    <i className="bi bi-building-gear me-1"></i> Manage Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/recruiter/jobs/new">
                    <i className="bi bi-plus-circle me-1"></i> Post a Job
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/candidate/profile">
                    <i className="bi bi-building me-1"></i> Company Profile
                  </Link>
                </li>
              </>
            )}

            {/* Admin options */}
            {user && user.role === 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/admin/stats">
                    <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/admin/users">
                    <i className="bi bi-people me-1"></i> Manage Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary" to="/admin/jobs">
                    <i className="bi bi-trash3 me-1"></i> Manage Jobs
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2" 
                  type="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span>{user.name}</span>
                  <span className="badge bg-secondary text-white text-uppercase" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item py-2" to="/candidate/profile">
                      <i className="bi bi-gear me-2"></i> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link className="btn btn-link text-decoration-none fw-semibold text-secondary" to="/login">Login</Link>
                <Link className="btn btn-primary px-4 shadow-sm" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
