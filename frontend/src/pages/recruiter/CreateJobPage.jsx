import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createJob } from '../../api/jobs';

const CreateJobPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('FullTime');
  const [salary, setSalary] = useState('');
  const [requirements, setRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !type) {
      setError("Please fill in all the required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        location,
        type,
        salary: salary ? parseFloat(salary) : null,
        requirements: requirements || null
      };

      await createJob(payload);
      navigate('/recruiter/jobs');
    } catch (err) {
      console.error("Failed to publish job offer", err);
      const msg = err.response?.data?.message || "Failed to publish job opening. Please check your data.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-12">
          
          <div className="mb-4">
            <Link to="/recruiter/jobs" className="text-decoration-none text-muted small fw-semibold">
              <i className="bi bi-chevron-left me-1"></i> Back to Manage Jobs
            </Link>
            <h1 className="fw-bold font-heading display-5 mt-2 mb-1">Post a New Job</h1>
            <p className="text-secondary mb-0">Publish an entry-level position or university internship offer.</p>
          </div>

          {error && <div className="alert alert-danger mb-4">{error}</div>}

          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label small fw-semibold text-secondary">Job / Internship Title <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control border-2" 
                      placeholder="e.g. Frontend React Developer Intern"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label small fw-semibold text-secondary">Location <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control border-2" 
                      placeholder="e.g. Casablanca / Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label small fw-semibold text-secondary">Job Type <span className="text-danger">*</span></label>
                    <select 
                      className="form-select border-2" 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    >
                      <option value="FullTime">Full Time</option>
                      <option value="PartTime">Part Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div className="col-md-6 col-12 mb-3">
                    <label className="form-label small fw-semibold text-secondary">Salary / Allowance (DH / Month)</label>
                    <input 
                      type="number" 
                      className="form-control border-2" 
                      placeholder="e.g. 4000 (Optional)"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Job Description <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control border-2" 
                    rows="6" 
                    placeholder="Provide a detailed description of the role, responsibilities, and expected outcomes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">Key Requirements / Skills</label>
                  <textarea 
                    className="form-control border-2" 
                    rows="4" 
                    placeholder="List minimum education, tech stack experience, languages, or prerequisite course profiles..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <Link to="/recruiter/jobs" className="btn btn-outline-secondary px-4">
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Publishing...
                      </>
                    ) : (
                      "Publish Offer"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;
