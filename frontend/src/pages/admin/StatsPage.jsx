import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load statistics dashboard", err);
        setError("Failed to fetch dashboard statistics. Verify authorization credentials.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Retrieving dashboard analytics..." />;

  if (error || !stats) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">{error || "Failed to load statistics."}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="fw-bold font-heading display-5 mb-1">Platform Dashboard</h1>
        <p className="text-secondary mb-0">Platform performance, user stats, and job analytics overview.</p>
      </div>

      {/* Analytics Card Row */}
      <div className="row g-4 mb-5">
        {/* User Card */}
        <div className="col-lg-3 col-md-6 col-12 animate-fade-in-up">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Total Accounts</span>
                <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
              <h2 className="fw-bold display-6 mb-1">{stats.totalUsers}</h2>
              <div className="small text-muted">
                {stats.totalCandidates} Candidates | {stats.totalRecruiters} Companies
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Card */}
        <div className="col-lg-3 col-md-6 col-12 animate-fade-in-up">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Published Offers</span>
                <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-briefcase-fill"></i>
                </div>
              </div>
              <h2 className="fw-bold display-6 mb-1">{stats.totalJobs}</h2>
              <div className="small text-muted">
                <span className="text-success fw-bold">● {stats.activeJobs} Active Offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Card */}
        <div className="col-lg-3 col-md-6 col-12 animate-fade-in-up">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Submitted Apps</span>
                <div className="bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-file-earmark-check-fill"></i>
                </div>
              </div>
              <h2 className="fw-bold display-6 mb-1">{stats.totalApplications}</h2>
              <div className="small text-muted">
                {stats.pendingApplications} Pending Review
              </div>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="col-lg-3 col-md-6 col-12 animate-fade-in-up">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small fw-bold text-uppercase">Acceptance Rate</span>
                <div className="bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
              </div>
              <h2 className="fw-bold display-6 mb-1">
                {stats.totalApplications > 0 
                  ? `${Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}%`
                  : '0%'
                }
              </h2>
              <div className="small text-muted">
                {stats.acceptedApplications} Shortlisted applications
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Analytics breakdowns */}
      <div className="row g-4">
        {/* Applications status ratios */}
        <div className="col-lg-6 col-12">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white h-100">
            <div className="card-body">
              <h4 className="fw-bold font-heading mb-4">Application Reviews Pipeline</h4>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1 small fw-semibold text-secondary">
                  <span>Pending Evaluation</span>
                  <span>{stats.pendingApplications} ({stats.totalApplications > 0 ? Math.round((stats.pendingApplications / stats.totalApplications) * 100) : 0}%)</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${stats.totalApplications > 0 ? (stats.pendingApplications / stats.totalApplications) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1 small fw-semibold text-secondary">
                  <span>Shortlisted / Hired</span>
                  <span>{stats.acceptedApplications} ({stats.totalApplications > 0 ? Math.round((stats.acceptedApplications / stats.totalApplications) * 100) : 0}%)</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: `${stats.totalApplications > 0 ? (stats.acceptedApplications / stats.totalApplications) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1 small fw-semibold text-secondary">
                  <span>Rejected / Closed</span>
                  <span>{stats.rejectedApplications} ({stats.totalApplications > 0 ? Math.round((stats.rejectedApplications / stats.totalApplications) * 100) : 0}%)</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${stats.totalApplications > 0 ? (stats.rejectedApplications / stats.totalApplications) * 100 : 0}%` }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* System activity logs */}
        <div className="col-lg-6 col-12">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white h-100">
            <div className="card-body">
              <h4 className="fw-bold font-heading mb-4">Quick Operations Shortcuts</h4>
              <p className="text-secondary small">As platform administrator, you hold central management controls. Use the navigation links to perform actions:</p>
              
              <div className="d-grid gap-3 mt-4">
                <Link to="/admin/users" className="btn btn-outline-primary py-2.5 text-start d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-people me-2"></i> Manage User Accounts</span>
                  <i className="bi bi-chevron-right"></i>
                </Link>
                <Link to="/admin/jobs" className="btn btn-outline-primary py-2.5 text-start d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-trash3 me-2"></i> Manage Active Listings</span>
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
