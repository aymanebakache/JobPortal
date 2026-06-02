import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getJobById } from '../../api/jobs';
import { applyForJob, getMyApplications } from '../../api/applications';
import { getProfile, uploadCv } from '../../api/profile';
import LoadingSpinner from '../../components/LoadingSpinner';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Application Form States
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Resume Upload States inside Modal
  const [hasCv, setHasCv] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobById(id);
        setJob(data);

        // Check if user already applied
        if (user && user.role === 'Candidate') {
          const apps = await getMyApplications();
          const match = apps.some((app) => app.jobId === parseInt(id));
          setAlreadyApplied(match);

          // Get profile CV details
          const profileData = await getProfile();
          if (profileData.profile && profileData.profile.cvUrl) {
            setHasCv(true);
            setCvUrl(profileData.profile.cvUrl);
          }
        }
      } catch (err) {
        console.error("Error loading job details", err);
        setError("Job not found or failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, user]);

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError("Only PDF format resumes are allowed.");
      return;
    }

    setUploadingCv(true);
    setUploadError(null);

    try {
      const response = await uploadCv(file);
      setHasCv(true);
      setCvUrl(response.cvUrl);
    } catch (err) {
      console.error("Failed to upload CV", err);
      setUploadError("Failed to upload CV. Please try again.");
    } finally {
      setUploadingCv(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!hasCv) {
      setError("You must upload a CV in PDF format before applying.");
      return;
    }

    setApplying(true);
    setError(null);

    try {
      await applyForJob(job.id, coverLetter);
      setApplied(true);
      setAlreadyApplied(true);
      
      // Close bootstrap modal if open
      const modalElement = document.getElementById('applyModal');
      if (modalElement) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement);
        if (bootstrapModal) bootstrapModal.hide();
      }
    } catch (err) {
      console.error("Failed to submit application", err);
      const msg = err.response?.data?.message || "Failed to submit application. Please try again.";
      setError(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job offer details..." />;

  if (error || !job) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning py-4 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle fs-2 mb-2 d-inline-block"></i>
          <h4 className="fw-bold">{error || "Job offer not found"}</h4>
          <p className="small mb-0">The job listing may have been deactivated or removed by the recruiter.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          Back to Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Main Details Body */}
        <div className="col-lg-8 col-12 mb-4">
          
          {/* Header Card */}
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white mb-4">
            <div className="card-body">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold mb-3">
                {job.type}
              </span>
              
              <h2 className="fw-bold font-heading display-6 mb-2">{job.title}</h2>
              
              <div className="d-flex align-items-center mb-4">
                <i className="bi bi-building text-secondary fs-4 me-2"></i>
                <span className="fs-5 fw-semibold text-secondary">{job.companyName}</span>
              </div>

              <div className="row g-3 py-3 border-top border-bottom border-light mb-2">
                <div className="col-md-4 col-6">
                  <span className="text-muted d-block small">Location</span>
                  <span className="fw-semibold text-secondary">
                    <i className="bi bi-geo-alt me-1"></i> {job.location}
                  </span>
                </div>
                <div className="col-md-4 col-6">
                  <span className="text-muted d-block small">Salary Package</span>
                  <span className="fw-bold text-success">
                    {job.salary ? `${job.salary.toLocaleString()} DH` : 'Negotiable'}
                  </span>
                </div>
                <div className="col-md-4 col-12">
                  <span className="text-muted d-block small">Date Published</span>
                  <span className="fw-semibold text-secondary">
                    <i className="bi bi-calendar-check me-1"></i> {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white mb-4">
            <div className="card-body">
              <h4 className="fw-bold font-heading mb-3 border-bottom pb-2">Job Description</h4>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                {job.description}
              </p>
            </div>
          </div>

          {/* Job Requirements */}
          {job.requirements && (
            <div className="card border-0 shadow-sm p-4 rounded-lg bg-white mb-4">
              <div className="card-body">
                <h4 className="fw-bold font-heading mb-3 border-bottom pb-2">Requirements / Prerequisites</h4>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                  {job.requirements}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="col-lg-4 col-12">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white position-sticky" style={{ top: '100px' }}>
            <h4 className="fw-bold font-heading mb-4">Application Details</h4>
            
            {applied && (
              <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                <div className="small">Your application was submitted successfully! Console log is generated.</div>
              </div>
            )}

            {/* Custom CTA Actions depending on login / roles */}
            {!user ? (
              <div className="d-grid gap-3">
                <p className="text-muted small text-center mb-0">You must be registered as a candidate to apply for this job offer.</p>
                <Link to="/login" className="btn btn-primary py-2.5">
                  Login to Apply
                </Link>
                <Link to="/register" className="btn btn-outline-primary py-2.5">
                  Create Candidate Account
                </Link>
              </div>
            ) : user.role === 'Candidate' ? (
              alreadyApplied ? (
                <div className="d-grid gap-3">
                  <button className="btn btn-secondary py-2.5" disabled>
                    Already Applied <i className="bi bi-patch-check-fill ms-1"></i>
                  </button>
                  <Link to="/candidate/applications" className="btn btn-outline-primary">
                    View Application Status
                  </Link>
                </div>
              ) : (
                <div className="d-grid gap-3">
                  <button 
                    type="button" 
                    className="btn btn-primary py-2.5 shadow-md"
                    data-bs-toggle="modal"
                    data-bs-target="#applyModal"
                  >
                    Apply Now <i className="bi bi-arrow-right-short ms-1 fs-5"></i>
                  </button>
                  <p className="text-muted small text-center mb-0">Applying takes less than 2 minutes.</p>
                </div>
              )
            ) : (
              <div className="alert alert-warning py-3 mb-0" role="alert">
                <i className="bi bi-exclamation-diamond-fill me-2 fs-5"></i>
                <span className="small">You are logged in as a <strong>{user.role}</strong>. Only <strong>Candidates</strong> can submit applications.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal Popup (Candidate only) */}
      {user && user.role === 'Candidate' && !alreadyApplied && (
        <div className="modal fade" id="applyModal" tabIndex="-1" aria-labelledby="applyModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-lg">
              
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold font-heading fs-4" id="applyModalLabel">Submit Application</h5>
                <button type="button" className="btn-close" data-bs-toggle="modal" aria-label="Close"></button>
              </div>
              
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body p-4">
                  <p className="text-secondary small mb-4">
                    Applying for <strong>{job.title}</strong> at <strong>{job.companyName}</strong>. Please review your details before submitting.
                  </p>

                  {/* CV Upload Check */}
                  <div className="mb-4 bg-light p-3 rounded">
                    <label className="form-label small fw-semibold text-secondary mb-2 d-block">
                      Your Resume (PDF Format) <span className="text-danger">*</span>
                    </label>

                    {hasCv ? (
                      <div className="d-flex justify-content-between align-items-center bg-white p-2 border rounded">
                        <span className="small text-truncate text-secondary me-2">
                          <i className="bi bi-filetype-pdf text-danger fs-5 me-1"></i>
                          CV Uploaded On Server
                        </span>
                        <a href={`http://localhost:5069${cvUrl}`} target="_blank" rel="noreferrer" className="badge bg-primary text-decoration-none">
                          View CV
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-white border border-dashed rounded">
                        <i className="bi bi-file-earmark-arrow-up text-muted fs-3 mb-2 d-block"></i>
                        <span className="small text-muted d-block mb-2">No CV found on your profile.</span>
                        <label className="btn btn-outline-primary btn-sm px-3 cursor-pointer">
                          {uploadingCv ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              Upload CV (PDF) <input type="file" className="d-none" accept=".pdf" onChange={handleCvUpload} />
                            </>
                          )}
                        </label>
                        {uploadError && <div className="text-danger small mt-2">{uploadError}</div>}
                      </div>
                    )}
                  </div>

                  {/* Optional Cover Letter */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Cover Letter / Message <span className="text-muted">(Optional)</span>
                    </label>
                    <textarea 
                      className="form-control border-2" 
                      rows="4" 
                      placeholder="Write a brief message explaining why you're a great fit for this internship..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary px-4" data-bs-toggle="modal" data-bs-target="#applyModal">Cancel</button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4" 
                    disabled={applying || !hasCv}
                  >
                    {applying ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Applying...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
