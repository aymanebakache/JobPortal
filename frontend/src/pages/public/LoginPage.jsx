import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../api/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to protected route, or home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await loginApi(email, password);
      // login context
      login(response.token, {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
      });

      // Role-specific home redirects
      if (from === "/") {
        if (response.role === 'Admin') {
          navigate('/admin/stats');
        } else if (response.role === 'Recruiter') {
          navigate('/recruiter/jobs');
        } else {
          navigate('/jobs');
        }
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login failed", err);
      const msg = err.response?.data?.message || "Invalid credentials. Please verify your email and password.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="col-md-5 col-12">
          
          <div className="text-center mb-4">
            <i className="bi bi-briefcase-fill text-primary display-4 mb-2 d-inline-block"></i>
            <h2 className="fw-bold font-heading">Welcome Back!</h2>
            <p className="text-secondary small">Access your recruitment and job dashboard.</p>
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
                  <div className="d-flex justify-content-between mb-1">
                    <label className="form-label fw-semibold small text-secondary mb-0">Password</label>
                  </div>
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
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login <i className="bi bi-box-arrow-in-right"></i>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-secondary small">New to the portal? </span>
                <Link to="/register" className="small fw-bold text-decoration-none text-primary">
                  Create a new account
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
