import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../../api/jobs';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';

const JobListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL search params if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilteredJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (type) params.type = type;
      if (minSalary) params.minSalary = minSalary;

      const data = await getJobs(params);
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs", err);
      setError("Failed to fetch jobs. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when searchParams change (or on initial load)
  useEffect(() => {
    fetchFilteredJobs();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (type) params.type = type;
    if (minSalary) params.minSalary = minSalary;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setType('');
    setMinSalary('');
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold font-heading display-5">Explore Career Opportunities</h1>
        <p className="text-secondary mb-0">Discover internships, graduate programs, and professional opportunities.</p>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-4 col-12 mb-4">
          <div className="card border-0 shadow-sm p-4 rounded-lg bg-white position-sticky" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold font-heading mb-0">Filters</h4>
              <button 
                type="button" 
                className="btn btn-link text-decoration-none text-muted small p-0 fw-semibold"
                onClick={handleClearFilters}
              >
                Clear All
              </button>
            </div>

            <form onSubmit={handleFilterSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Search Keyword</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-2 border-end-0">
                    <FaSearch />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-2 border-start-0 ps-0" 
                    placeholder="Job title, company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Location</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-2 border-end-0">
                    <FaMapMarkerAlt />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-2 border-start-0 ps-0" 
                    placeholder="e.g. Casablanca, Remote..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Employment Type</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-2 border-end-0">
                    <FaBriefcase />
                  </span>
                  <select 
                    className="form-select border-2 border-start-0 ps-0" 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="FullTime">Full Time</option>
                    <option value="PartTime">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Minimum Salary (DH)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-2 border-end-0">
                    <FaMoneyBillWave />
                  </span>
                  <input 
                    type="number" 
                    className="form-control border-2 border-start-0 ps-0" 
                    placeholder="e.g. 5000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2.5 shadow-sm">
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Jobs Results List */}
        <div className="col-lg-8 col-12">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Searching matching job offers..." />
          ) : jobs.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 rounded-lg bg-white text-center">
              <div className="card-body py-5">
                <FaSearch className="text-muted display-3 mb-3 d-inline-block" />
                <h4 className="fw-bold font-heading">No Jobs Found</h4>
                <p className="text-secondary small mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  We couldn't find any active jobs matching your filters. Try widening your search keywords or location!
                </p>
                <button className="btn btn-primary" onClick={handleClearFilters}>
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4 ps-2">
                <span className="text-secondary small fw-semibold">{jobs.length} Positions Available</span>
              </div>
              
              <div className="row">
                {jobs.map((job) => (
                  <div key={job.id} className="col-12">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListPage;
