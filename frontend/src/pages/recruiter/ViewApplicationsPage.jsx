import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../../api/jobs';
import { getJobApplications, updateApplicationStatus } from '../../api/applications';
import LoadingSpinner from '../../components/LoadingSpinner';

const ViewApplicationsPage = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchApplicationsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobDetails = await getJobById(jobId);
      setJob(jobDetails);

      const apps = await getJobApplications(jobId);
      setApplications(apps);
    } catch (err) {
      console.error("Failed to load applicants", err);
      setError("Failed to load applicants or you are not authorized to view this page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationsData();
  }, [jobId]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      // Update local state
      setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      setActionSuccess(`Applicant status set to ${newStatus}. Notification logged to console!`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to update applicant status", err);
      setError("Failed to update status.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1.5 rounded-pill small fw-semibold">Pending Review</span>;
      case 'Accepted':
        return <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill small fw-semibold">Shortlisted</span>;
      case 'Rejected':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-pill small fw-semibold">Rejected</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2.5 py-1.5 rounded-pill small fw-semibold">{status}</span>;
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving applicant submissions..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/recruiter/jobs" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-chevron-left me-1"></i> Back to Manage Jobs
        </Link>
        <h1 className="fw-bold font-heading display-5 mt-2 mb-1">Applicants List</h1>
        <p className="text-secondary mb-0">
          Reviewing applications for <strong className="text-primary">{job?.title}</strong>
        </p>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {actionSuccess && (
        <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{actionSuccess}</div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 rounded-lg bg-white text-center">
          <div className="card-body py-5 animate-fade-in-up">
            <i className="bi bi-people text-muted display-3 mb-3 d-inline-block"></i>
            <h4 className="fw-bold font-heading">No Applicants Yet</h4>
            <p className="text-secondary small mb-0" style={{ maxWidth: '400px', margin: '0 auto' }}>
              We haven't received any candidate profiles for this posting yet. Make sure your posting is active to receive submissions!
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {applications.map((app) => (
            <div key={app.id} className="col-12">
              <div className={`card border-0 shadow-sm p-4 rounded-lg bg-white border-start border-4 ${app.status === 'Accepted' ? 'border-success' : app.status === 'Rejected' ? 'border-danger' : 'border-warning'}`}>
                <div className="card-body">
                  <div className="row g-3">
                    
                    {/* Candidate Details */}
                    <div className="col-lg-5 col-md-12">
                      <div className="d-flex align-items-start gap-3">
                        <div className="bg-light text-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', flexShrink: '0' }}>
                          <i className="bi bi-person fs-3"></i>
                        </div>
                        <div>
                          <h5 className="fw-bold font-heading mb-1">{app.candidateName}</h5>
                          <p className="text-secondary small mb-2">
                            <i className="bi bi-envelope"></i> {app.candidateEmail}
                          </p>
                          <div className="d-flex align-items-center gap-2">
                            {getStatusBadge(app.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Candidate Resume & Cover Letter */}
                    <div className="col-lg-4 col-md-12 border-start border-light ps-lg-4">
                      {app.cvUrl ? (
                        <div className="mb-2">
                          <span className="small text-muted d-block">Resume / CV</span>
                          <a 
                            href={`http://localhost:5069${app.cvUrl}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn btn-outline-primary btn-sm px-3 mt-1"
                          >
                            <i className="bi bi-file-earmark-pdf text-danger me-1"></i> View Candidate CV (PDF)
                          </a>
                        </div>
                      ) : (
                        <div className="mb-2 small text-muted">
                          <i className="bi bi-exclamation-triangle text-warning"></i> No CV uploaded
                        </div>
                      )}

                      {app.coverLetter && (
                        <div className="mt-3">
                          <span className="small text-muted d-block fw-semibold">Cover Letter / Message:</span>
                          <p className="small text-secondary mb-0 bg-light p-2.5 rounded border mt-1" style={{ whiteSpace: 'pre-line', maxHeight: '120px', overflowY: 'auto' }}>
                            {app.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quick Review Operations */}
                    <div className="col-lg-3 col-md-12 d-flex flex-row flex-lg-column gap-2 justify-content-end align-items-center align-items-lg-end">
                      {app.status === 'Pending' ? (
                        <>
                          <button 
                            className="btn btn-success btn-sm w-100 py-2.5 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                            onClick={() => handleUpdateStatus(app.id, 'Accepted')}
                          >
                            <i className="bi bi-check-circle"></i> Shortlist Candidate
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm w-100 py-2.5 d-flex align-items-center justify-content-center gap-1"
                            onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                          >
                            <i className="bi bi-x-circle"></i> Reject Application
                          </button>
                        </>
                      ) : (
                        <div className="text-end">
                          <button 
                            className="btn btn-link text-decoration-none text-muted small fw-semibold"
                            onClick={() => handleUpdateStatus(app.id, 'Pending')}
                          >
                            Re-evaluate Candidate
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplicationsPage;
