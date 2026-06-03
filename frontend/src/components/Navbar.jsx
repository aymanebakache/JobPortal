import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBriefcase, FaSearch, FaFileAlt, FaUserTie, FaBuilding, FaPlusCircle, FaTachometerAlt, FaUsers, FaTrashAlt, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-premium navbar-light sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaBriefcase className="text-primary me-2 fs-3" />
          <span className="fw-bold fs-4 text-primary font-heading">UniRecruit</span>
        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/jobs">
                <FaSearch /> Browse Jobs
              </Link>
            </li>
            
            {/* Candidate options */}
            {user && user.role === 'Candidate' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/candidate/applications">
                    <FaFileAlt /> My Applications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/candidate/profile">
                    <FaUserTie /> My Profile
                  </Link>
                </li>
              </>
            )}

            {/* Recruiter options */}
            {user && user.role === 'Recruiter' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/recruiter/jobs">
                    <FaBriefcase /> Manage Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/recruiter/jobs/new">
                    <FaPlusCircle /> Post a Job
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/candidate/profile">
                    <FaBuilding /> Company Profile
                  </Link>
                </li>
              </>
            )}

            {/* Admin options */}
            {user && user.role === 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/admin/stats">
                    <FaTachometerAlt /> Admin Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/admin/users">
                    <FaUsers /> Manage Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-secondary d-flex align-items-center gap-1" to="/admin/jobs">
                    <FaTrashAlt /> Manage Jobs
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown" ref={dropdownRef}>
                <button 
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2" 
                  type="button" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle className="fs-5" />
                  <span>{user.name}</span>
                  <span className="badge bg-secondary text-white text-uppercase" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow-sm border-0 ${dropdownOpen ? 'show' : ''}`} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050 }}>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/settings" onClick={() => setDropdownOpen(false)}>
                      <FaCog /> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={() => { setDropdownOpen(false); handleLogout(); }}>
                      <FaSignOutAlt /> Logout
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
