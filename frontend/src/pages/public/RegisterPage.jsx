import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../api/auth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Candidate');
  
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await registerApi(name, email, password, role);
      // Auto-login upon registration success
      login(response.token, {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
      });

      // Redirect to profile setup
      navigate('/candidate/profile');
    } catch (err) {
      console.error("Registration failed", err);
      const msg = err.response?.data?.message || "Registration failed. This email may already be in use.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-md-6 col-12">
          
          <div className="text-center mb-4">
            <i className="bi bi-person-plus text-primary display-4 mb-2 d-inline-block"></i>
            <h2 className="fw-bold font-heading">Create Your Account</h2>
            <p className="text-secondary small">Join UniRecruit to browse or publish career opportunities.</p>
          </div>

          <div className="card border-0 shadow-lg p-4 rounded-lg bg-white">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <label className="form-label fw-semibold small text-secondary">Join As</label>
                  <div className="col-6">
                    <button 
                      type="button" 
                      className={`btn w-100 py-3 d-flex flex-column align-items-center gap-1 ${role === 'Candidate' ? 'btn-primary shadow-md' : 'btn-outline-primary'}`}
                      onClick={() => setRole('Candidate')}
                    >
                      <i className="bi bi-mortarboard fs-3"></i>
                      <span>Student</span>
                      <small style={{ fontSize: '0.65rem', opacity: '0.8' }}>Apply for Internships</small>
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      type="button" 
                      className={`btn w-100 py-3 d-flex flex-column align-items-center gap-1 ${role === 'Recruiter' ? 'btn-primary shadow-md' : 'btn-outline-primary'}`}
                      onClick={() => setRole('Recruiter')}
                    >
                      <i className="bi bi-building fs-3"></i>
                      <span>Company</span>
                      <small style={{ fontSize: '0.65rem', opacity: '0.8' }}>Publish & Hire</small>
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Full Name / Organization Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-2 border-end-0">
                      <i className="bi bi-person"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-2 border-start-0 ps-0" 
                      placeholder="e.g. John Doe / Microsoft"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-2 border-end-0">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      className="form-control border-2 border-start-0 ps-0" 
                      placeholder="name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Password (6+ characters)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-2 border-end-0">
                      <i className="bi bi-shield-lock"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control border-2 border-start-0 ps-0" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-3 shadow-md mb-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Registering Account...
                    </>
                  ) : (
                    <>
                      Create Account <i className="bi bi-check-circle"></i>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-secondary small">Already have an account? </span>
                <Link to="/login" className="small fw-bold text-decoration-none text-primary">
                  Login here
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
