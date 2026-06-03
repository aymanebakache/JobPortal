import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaArrowRight } from 'react-icons/fa';

const JobCard = ({ job, index = 0 }) => {
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card premium-card mb-4 border-0 h-100"
    >
      <div className="card-body p-4 d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className={`badge border badge-premium ${getTypeBadgeClass(type)} mb-2`}>
              {type === 'FullTime' ? 'Full Time' : type === 'PartTime' ? 'Part Time' : type}
            </span>
            <h5 className="card-title fw-bold fs-4 mb-1">{title}</h5>
            <p className="text-secondary fw-semibold mb-0 d-flex align-items-center gap-2">
              <FaBuilding className="text-muted" /> {companyName || 'Confidential Company'}
            </p>
          </div>
          
          <div className="text-end">
            {salary ? (
              <span className="fw-bold fs-5" style={{ color: 'var(--primary-color)' }}>
                {salary.toLocaleString()} DH
              </span>
            ) : (
              <span className="text-muted small">Salary Undisclosed</span>
            )}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-3 text-secondary small mb-4 flex-grow-1">
          <span className="d-flex align-items-center gap-1">
            <FaMapMarkerAlt className="text-muted" /> {location}
          </span>
          <span className="d-flex align-items-center gap-1">
            <FaCalendarAlt className="text-muted" /> Posted {formatDate(postedAt)}
          </span>
          {applicationCount !== undefined && (
            <span className="d-flex align-items-center gap-1">
              <FaUsers className="text-muted" /> {applicationCount} Apps
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="d-flex align-items-center gap-2">
            {!isActive && (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded">Inactive</span>
            )}
          </div>
          <Link to={`/jobs/${id}`} className="btn btn-outline-primary btn-sm px-4 d-flex align-items-center gap-2">
            View Details <FaArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
