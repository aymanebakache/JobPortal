import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, updateJob, deleteJob } from '../../api/jobs';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load recruiter jobs", err);
      setError("Failed to retrieve your job postings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleActive = async (jobId, currentStatus) => {
    try {
      await updateJob(jobId, { isActive: !currentStatus });
      // Update local state
      setJobs(jobs.map(j => j.id === jobId ? { ...j, isActive: !currentStatus } : j));
      setActionSuccess(`Job status updated successfully.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to toggle status", err);
      setError("Failed to update job status.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to permanently delete this job listing? All associated applications will also be deleted.")) {
      return;
    }

    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      setActionSuccess("Job listing deleted successfully.");
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to delete job", err);
      setError("Failed to delete job offer.");
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving your posted jobs..." />;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 className="fw-bold font-heading display-5 mb-1">Manage Jobs</h1>
          <p className="text-secondary mb-0">Publish and manage recruitment postings, view applicant submissions.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary px-4 shadow-sm">
          <i className="bi bi-plus-circle me-1"></i> Post New Job
        </Link>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {actionSuccess && (
        <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{actionSuccess}</div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 rounded-lg bg-white text-center">
          <div className="card-body py-5 animate-fade-in-up">
            <i className="bi bi-briefcase text-muted display-3 mb-3 d-inline-block"></i>
            <h4 className="fw-bold font-heading">No Jobs Published Yet</h4>
            <p className="text-secondary small mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
              Create your first job or internship posting to start receiving applications from university talents.
            </p>
            <Link to="/recruiter/jobs/new" className="btn btn-primary px-4 shadow-sm">
              Post Your First Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div key={job.id} className="col-12 col-xl-6">
              <div className="card premium-card border-0 mb-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-2 rounded-pill font-heading">
                        {job.type}
                      </span>
                      <h4 className="fw-bold font-heading mb-1">{job.title}</h4>
                      <span className="text-muted small">
                        <i className="bi bi-geo-alt me-1"></i> {job.location} | Posted {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="form-check form-switch" title={job.isActive ? "Deactivate job offer" : "Activate job offer"}>
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id={`switch-${job.id}`}
                        checked={job.isActive}
                        onChange={() => handleToggleActive(job.id, job.isActive)}
                        style={{ width: '2.5em', height: '1.25em', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="row g-3 py-3 border-top border-bottom border-light mb-3">
                    <div className="col-6">
                      <span className="text-muted d-block small">Salary Package</span>
                      <span className="fw-bold text-secondary">
                        {job.salary ? `${job.salary.toLocaleString()} DH` : 'Negotiable'}
                      </span>
                    </div>
                    <div className="col-6 border-start border-light">
                      <span className="text-muted d-block small">Applications Received</span>
                      <span className="fw-bold text-primary fs-5">
                        {job.applicationCount} Applicants
                      </span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <Link to={`/recruiter/applications/${job.id}`} className="btn btn-primary btn-sm px-3">
                        <i className="bi bi-people me-1"></i> Applicants
                      </Link>
                      
                      <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn-outline-primary btn-sm px-3">
                        <i className="bi bi-pencil me-1"></i> Edit
                      </Link>
                    </div>

                    <button 
                      className="btn btn-link text-danger text-decoration-none small p-0 fw-semibold"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
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

export default ManageJobsPage;
