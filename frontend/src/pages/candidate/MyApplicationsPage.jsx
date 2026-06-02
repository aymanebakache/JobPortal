import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../api/applications';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load candidate applications", err);
        setError("Failed to fetch applications. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-1.5 rounded-pill fw-semibold">Pending Review</span>;
      case 'Accepted':
        return <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill fw-semibold">Accepted / Shortlisted</span>;
      case 'Rejected':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1.5 rounded-pill fw-semibold">Rejected / Not Selected</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-1.5 rounded-pill fw-semibold">{status}</span>;
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving your applications history..." />;

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="fw-bold font-heading display-5 mb-1">My Applications</h1>
        <p className="text-secondary mb-0">Track and oversee all your active job and internship applications.</p>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {applications.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 rounded-lg bg-white text-center">
          <div className="card-body py-5 animate-fade-in-up">
            <i className="bi bi-file-earmark-check text-muted display-3 mb-3 d-inline-block"></i>
            <h4 className="fw-bold font-heading">No Applications Submitted</h4>
            <p className="text-secondary small mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
              You haven't applied for any jobs or internships yet. Start exploring active job posts to kickstart your career!
            </p>
            <Link to="/jobs" className="btn btn-primary px-4 shadow-sm">
              Explore Open Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-lg bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ minWidth: '800px' }}>
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Position & Company</th>
                  <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Date Applied</th>
                  <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Cover Letter Context</th>
                  <th className="py-3 px-4 text-secondary small fw-bold text-uppercase text-center">Status</th>
                  <th className="py-3 px-4 text-secondary small fw-bold text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3.5 px-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', flexShrink: '0' }}>
                          <i className="bi bi-briefcase-fill"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{app.jobTitle}</h6>
                          <small className="text-secondary fw-semibold">
                            <i className="bi bi-building"></i> {app.companyName}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-secondary small">
                      {new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-secondary mb-0 small text-truncate" style={{ maxWidth: '240px' }} title={app.coverLetter}>
                        {app.coverLetter ? app.coverLetter : <em className="text-muted">No message attached</em>}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <Link to={`/jobs/${app.jobId}`} className="btn btn-outline-primary btn-sm">
                        View Offer
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
