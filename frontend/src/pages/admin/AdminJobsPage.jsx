import React, { useState, useEffect } from 'react';
import { getJobs, deleteJob } from '../../api/jobs';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');

  const fetchAllJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all jobs including inactive ones (Admin endpoints can return all or we just read from general jobs)
      // Since getJobs returns active ones, we'll fetch from jobs
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs", err);
      setError("Failed to fetch jobs listing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete job posting "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      setSuccess(`Job posting "${title}" deleted successfully.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to delete job", err);
      setError("Failed to delete job listing.");
    }
  };

  const filteredJobs = jobs.filter((j) => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.companyName.toLowerCase().includes(search.toLowerCase()) || 
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Retrieving platform job postings..." />;

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-3">
        <div>
          <h1 className="fw-bold font-heading display-5 mb-1">Manage Jobs (Admin)</h1>
          <p className="text-secondary mb-0">Platform administrative oversight: review and delete any active job postings.</p>
        </div>

        <div className="col-md-4 col-12">
          <div className="input-group">
            <span className="input-group-text bg-white border-2 border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-2 border-start-0 ps-0" 
              placeholder="Search by title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {success && (
        <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{success}</div>
        </div>
      )}

      <div className="card border-0 shadow-sm rounded-lg bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ minWidth: '800px' }}>
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Job Posting Details</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Company</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Location</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Salary</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase text-center">Type</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    No active job listings found matching query filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((j) => (
                  <tr key={j.id}>
                    <td className="py-3.5 px-4">
                      <div>
                        <h6 className="fw-bold mb-0">{j.title}</h6>
                        <small className="text-muted">ID: #{j.id} | Published: {new Date(j.postedAt).toLocaleDateString()}</small>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-secondary small fw-semibold">
                      {j.companyName}
                    </td>
                    <td className="py-3.5 px-4 text-secondary small">
                      {j.location}
                    </td>
                    <td className="py-3.5 px-4 text-secondary small font-heading fw-bold">
                      {j.salary ? `${j.salary.toLocaleString()} DH` : 'Negotiable'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="badge bg-light text-secondary border px-2 py-1 rounded">
                        {j.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteJob(j.id, j.title)}
                      >
                        <i className="bi bi-trash"></i> Delete Post
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminJobsPage;
