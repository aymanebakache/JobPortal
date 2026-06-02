import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const { id, title, companyName, location, salary, type, postedAt, isActive, applicationCount } = job;

  const getTypeBadgeClass = (jobType) => {
    switch (jobType) {
      case 'FullTime': return 'bg-primary-subtle text-primary border-primary-subtle';
      case 'PartTime': return 'bg-info-subtle text-info border-info-subtle';
      case 'Internship': return 'bg-success-subtle text-success border-success-subtle';
      case 'Remote': return 'bg-purple-subtle text-purple border-purple-subtle';
      default: return 'bg-secondary-subtle text-secondary border-secondary-subtle';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card premium-card mb-4 border-0">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className={`badge border badge-premium ${getTypeBadgeClass(type)} mb-2`}>
              {type === 'FullTime' ? 'Full Time' : type === 'PartTime' ? 'Part Time' : type}
            </span>
            <h5 className="card-title fw-bold fs-4 mb-1">{title}</h5>
            <p className="text-secondary fw-semibold mb-0">
              <i className="bi bi-building me-1"></i> {companyName}
            </p>
          </div>
          
          <div className="text-end">
            {salary ? (
              <span className="fw-bold fs-5 text-indigo-600" style={{ color: '#4f46e5' }}>
                {salary.toLocaleString()} DH
              </span>
            ) : (
              <span className="text-muted small">Salary Undisclosed</span>
            )}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-3 text-secondary small mb-4">
          <span>
            <i className="bi bi-geo-alt me-1"></i> {location}
          </span>
          <span>
            <i className="bi bi-calendar-event me-1"></i> Posted on {formatDate(postedAt)}
          </span>
          {applicationCount !== undefined && (
            <span>
              <i className="bi bi-people me-1"></i> {applicationCount} Applications
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            {!isActive && (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded">Inactive</span>
            )}
          </div>
          <Link to={`/jobs/${id}`} className="btn btn-outline-primary btn-sm px-4">
            View Details <i className="bi bi-arrow-right-short ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
