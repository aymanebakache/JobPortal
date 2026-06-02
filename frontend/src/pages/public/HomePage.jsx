import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJobs } from '../../api/jobs';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const HomePage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobs();
        // Take top 3 for featured
        setFeaturedJobs(jobs.slice(0, 3));
      } catch (err) {
        console.error("Error loading featured jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div>
      {/* Premium Hero Section */}
      <section className="hero-section text-center text-lg-start">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0 animate-fade-in-up">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-bold mb-3">
                🎓 EXCLUSIVE FOR STUDENTS & RECRUITERS
              </span>
              <h1 className="display-4 fw-extrabold mb-3" style={{ lineHeight: '1.2' }}>
                Find Your Dream <span className="gradient-text">Internship</span> or First Graduate Job
              </h1>
              <p className="lead text-secondary mb-4 fs-5" style={{ maxWidth: '90%' }}>
                Connecting university talents directly with top-tier companies. Your recruitment portal for professional growth and internship success.
              </p>

              {/* Direct Quick Search Bar */}
              <div className="card border-0 shadow-lg p-3 glass-panel rounded-xl" style={{ maxWidth: '95%' }}>
                <form onSubmit={handleSearchSubmit} className="row g-2">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="bi bi-search"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-0 bg-transparent ps-0" 
                        placeholder="Job title, keywords..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 border-start border-md-0">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-0 bg-transparent ps-0" 
                        placeholder="Location..." 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 d-grid">
                    <button type="submit" className="btn btn-primary shadow">
                      Search
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-4 d-flex flex-wrap gap-3 align-items-center text-secondary small">
                <span className="fw-semibold">Popular categories:</span>
                <Link to="/jobs?type=Internship" className="badge bg-light text-secondary border text-decoration-none px-3 py-2">Software Engineering</Link>
                <Link to="/jobs?type=Internship" className="badge bg-light text-secondary border text-decoration-none px-3 py-2">Data Science</Link>
                <Link to="/jobs?type=Internship" className="badge bg-light text-secondary border text-decoration-none px-3 py-2">Remote</Link>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block text-center position-relative">
              <div className="position-absolute bg-primary-subtle rounded-circle filter-blur" style={{ width: '400px', height: '400px', top: '-50px', right: '-50px', filter: 'blur(80px)', opacity: '0.6', zIndex: '0' }}></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                alt="University Recruitment Collaboration" 
                className="img-fluid rounded-xl shadow-2xl position-relative border border-white border-4" 
                style={{ zIndex: '1', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Why Choose <span className="gradient-text">UniRecruit</span>?</h2>
            <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Built specifically to facilitate academic recruitment, internships, and entry-level career stages.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 h-100 p-4 rounded-lg bg-light text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-mortarboard fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2">Student Profiles</h4>
                <p className="text-secondary small">
                  Build your custom profile, add academic highlights, summarize your technical skills, and upload your PDF resume securely.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 h-100 p-4 rounded-lg bg-light text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-patch-check fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2">Direct Internships</h4>
                <p className="text-secondary small">
                  Connect immediately with leading local and international firms posting official part-time and summer internships.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 h-100 p-4 rounded-lg bg-light text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-info-subtle text-info rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-clock-history fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2">Mock Notification Alerts</h4>
                <p className="text-secondary small">
                  Stay updated instantly! Our mock alert service logs and reports exact job status progress on console when applications update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold display-6 mb-1">Latest Job Openings</h2>
              <p className="text-secondary mb-0">Browse recently posted internships and job positions.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary d-none d-sm-inline-block">
              View All Openings <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching featured job opportunities..." />
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-briefcase text-muted fs-1 mb-3"></i>
              <p className="text-secondary fw-semibold">No jobs posted recently. Check back soon!</p>
            </div>
          ) : (
            <div className="row">
              {featuredJobs.map((job) => (
                <div key={job.id} className="col-lg-4 col-md-6 col-12">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4 d-sm-none">
            <Link to="/jobs" className="btn btn-outline-primary w-100">
              View All Openings <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
