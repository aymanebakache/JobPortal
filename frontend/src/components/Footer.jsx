import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub, FaBriefcase } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto" style={{ zIndex: 10 }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center mb-3">
              <FaBriefcase className="text-primary fs-4 me-2" />
              <h5 className="mb-0 fw-bold gradient-text">JobPortal</h5>
            </div>
            <p className="text-muted small pe-md-4">
              Connecting top talent with the world's most innovative companies. 
              Built for excellence, designed for success. A modern academic capstone project.
            </p>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="mb-3 fw-bold">Platform</h6>
            <ul className="list-unstyled text-muted small">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="mb-2"><Link to="/jobs" className="text-decoration-none text-muted">Browse Jobs</Link></li>
              <li className="mb-2"><Link to="/login" className="text-decoration-none text-muted">Sign In</Link></li>
              <li className="mb-2"><Link to="/register" className="text-decoration-none text-muted">Create Account</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="mb-3 fw-bold">Connect</h6>
            <div className="d-flex gap-3 mb-3">
              <a href="#" className="text-muted fs-5"><FaLinkedin /></a>
              <a href="#" className="text-muted fs-5"><FaTwitter /></a>
              <a href="#" className="text-muted fs-5"><FaGithub /></a>
            </div>
          </div>
        </div>
        <hr className="my-4 border-light" />
        <div className="text-center text-muted small">
          &copy; {new Date().getFullYear()} JobPortal Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
