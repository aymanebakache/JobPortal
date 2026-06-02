import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateCandidateProfile, updateRecruiterProfile, uploadCv } from '../../api/profile';
import LoadingSpinner from '../../components/LoadingSpinner';

const CandidateProfilePage = () => {
  const { user } = useAuth();
  const isCandidate = user?.role === 'Candidate';

  // Common Profile States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Candidate Specific Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Recruiter Specific Fields
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [website, setWebsite] = useState('');

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfile();
      if (isCandidate) {
        const cp = response.profile;
        setName(cp.name || user.name);
        setPhone(cp.phone || '');
        setSkills(cp.skills || '');
        setEducation(cp.education || '');
        setCvUrl(cp.cvUrl || '');
      } else {
        const rp = response.profile;
        setName(rp.name || user.name);
        setCompanyName(rp.companyName || '');
        setCompanyDescription(rp.companyDescription || '');
        setWebsite(rp.website || '');
      }
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Could not retrieve profile details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError("Only PDF documents are allowed for CV uploads.");
      setUploadSuccess(false);
      return;
    }

    setUploadingCv(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const response = await uploadCv(file);
      setCvUrl(response.cvUrl);
      setUploadSuccess(true);
    } catch (err) {
      console.error("CV upload failed", err);
      setUploadError("Failed to upload file to the server filesystem.");
    } finally {
      setUploadingCv(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (isCandidate) {
        const updated = await updateCandidateProfile({
          name,
          phone,
          skills,
          education
        });
        setName(updated.name);
        setPhone(updated.phone);
        setSkills(updated.skills);
        setEducation(updated.education);
      } else {
        const updated = await updateRecruiterProfile({
          name,
          companyName,
          companyDescription,
          website
        });
        setName(updated.name);
        setCompanyName(updated.companyName);
        setCompanyDescription(updated.companyDescription);
        setWebsite(updated.website);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save profile", err);
      setError("Failed to update profile settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving your profile..." />;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-12">
          
          <div className="d-flex align-items-center gap-3 mb-5 border-bottom pb-4">
            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
              <i className={isCandidate ? "bi bi-mortarboard fs-1" : "bi bi-building fs-1"}></i>
            </div>
            <div>
              <h2 className="fw-bold font-heading mb-1">{name || user?.name}</h2>
              <p className="text-secondary mb-0">
                <span className="badge bg-secondary text-uppercase me-2">{user?.role}</span>
                {user?.email}
              </p>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-4">{error}</div>}
          {success && (
            <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i>
              <div>Profile changes saved successfully!</div>
            </div>
          )}

          <div className="row g-4">
            {/* Main Fields Form */}
            <div className="col-md-8 col-12">
              <div className="card border-0 shadow-sm p-4 rounded-lg bg-white">
                <div className="card-body">
                  <h4 className="fw-bold font-heading mb-4">Account Settings</h4>
                  
                  <form onSubmit={handleFormSubmit}>
                    {/* Common Name field */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">
                        {isCandidate ? "Full Name" : "Company / Contact Representative Name"}
                      </label>
                      <input 
                        type="text" 
                        className="form-control border-2" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {isCandidate ? (
                      /* Candidate Only Fields */
                      <>
                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                          <input 
                            type="tel" 
                            className="form-control border-2" 
                            placeholder="+212 600 00 00 00"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-secondary">Education / Degree Details</label>
                          <textarea 
                            className="form-control border-2" 
                            rows="2"
                            placeholder="e.g. Master's in Computer Engineering - ENSAS (2024 - 2026)"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                          ></textarea>
                        </div>

                        <div className="mb-4">
                          <label className="form-label small fw-semibold text-secondary">Technical Skills (Comma separated)</label>
                          <input 
                            type="text" 
                            className="form-control border-2" 
                            placeholder="React, C#, EF Core, SQL, REST APIs"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                          />
                          <div className="mt-2 d-flex flex-wrap gap-1.5">
                            {skills.split(',').map((skill, idx) => {
                              const clean = skill.trim();
                              if (!clean) return null;
                              return (
                                <span key={idx} className="badge bg-light text-secondary border px-2.5 py-1">
                                  {clean}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Recruiter Only Fields */
                      <>
                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-secondary">Company Name</label>
                          <input 
                            type="text" 
                            className="form-control border-2" 
                            placeholder="e.g. Tech Solutions SARL"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-semibold text-secondary">Website URL</label>
                          <input 
                            type="url" 
                            className="form-control border-2" 
                            placeholder="https://example.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="form-label small fw-semibold text-secondary">Company Description</label>
                          <textarea 
                            className="form-control border-2" 
                            rows="4" 
                            placeholder="Describe your organization, values, and core technical areas..."
                            value={companyDescription}
                            onChange={(e) => setCompanyDescription(e.target.value)}
                          ></textarea>
                        </div>
                      </>
                    )}

                    <button 
                      type="submit" 
                      className="btn btn-primary px-4 shadow-sm"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Saving Profile...
                        </>
                      ) : (
                        "Save Profile Changes"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Candidate Resume CV Upload Sidecard */}
            {isCandidate && (
              <div className="col-md-4 col-12">
                <div className="card border-0 shadow-sm p-4 rounded-lg bg-white">
                  <div className="card-body text-center">
                    <h5 className="fw-bold font-heading mb-3 text-start">Curriculum Vitae</h5>
                    
                    {cvUrl ? (
                      <div className="py-3">
                        <i className="bi bi-file-earmark-pdf-fill text-danger display-4 mb-2 d-inline-block"></i>
                        <p className="small text-secondary fw-semibold">Resume uploaded and active on your profile!</p>
                        
                        <div className="d-grid gap-2 mt-3">
                          <a 
                            href={`http://localhost:5069${cvUrl}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-eye"></i> View Current CV
                          </a>
                          
                          <label className="btn btn-outline-secondary btn-sm cursor-pointer mb-0">
                            {uploadingCv ? "Replacing..." : "Replace CV (PDF)"}
                            <input type="file" className="d-none" accept=".pdf" onChange={handleCvUpload} disabled={uploadingCv} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 border border-dashed rounded-lg bg-light">
                        <i className="bi bi-cloud-arrow-up text-muted display-4 mb-2 d-inline-block"></i>
                        <p className="small text-muted mb-3">Upload your professional resume in PDF format to start applying.</p>
                        
                        <label className="btn btn-primary btn-sm px-4 cursor-pointer mb-0">
                          {uploadingCv ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                              Uploading...
                            </>
                          ) : (
                            "Upload CV (PDF)"
                          )}
                          <input type="file" className="d-none" accept=".pdf" onChange={handleCvUpload} disabled={uploadingCv} />
                        </label>
                      </div>
                    )}

                    {uploadError && <div className="text-danger small mt-2">{uploadError}</div>}
                    {uploadSuccess && <div className="text-success small mt-2">✓ CV Uploaded successfully!</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
