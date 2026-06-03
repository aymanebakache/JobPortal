import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaBriefcase, FaFileAlt, FaChartLine, FaUserTie, FaBuilding } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load statistics dashboard", err);
        setError("Failed to fetch dashboard statistics. Verify authorization credentials.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Retrieving dashboard analytics..." />;

  if (error || !stats) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">{error || "Failed to load statistics."}</div>
      </div>
    );
  }

  // Data for Recharts
  const userDistributionData = [
    { name: 'Candidates', value: stats.totalCandidates, color: '#4f46e5' },
    { name: 'Recruiters', value: stats.totalRecruiters, color: '#10b981' },
  ];

  const applicationStatusData = [
    { name: 'Pending', count: stats.pendingApplications, color: '#f59e0b' },
    { name: 'Accepted', count: stats.acceptedApplications, color: '#10b981' },
    { name: 'Rejected', count: stats.rejectedApplications, color: '#ef4444' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h1 className="fw-bold font-heading display-5 mb-1">Platform Dashboard</h1>
        <p className="text-secondary mb-0">Platform performance, user stats, and job analytics overview.</p>
      </div>

      {/* Analytics Card Row */}
      <div className="row g-4 mb-5">
        {/* User Card */}
        <motion.div className="col-lg-3 col-md-6 col-12" variants={cardVariants} initial="hidden" animate="visible">
          <div className="premium-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold text-uppercase">Total Accounts</span>
              <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <FaUsers className="fs-5" />
              </div>
            </div>
            <h2 className="fw-bold display-6 mb-1">{stats.totalUsers}</h2>
            <div className="small text-muted d-flex gap-2">
              <span title="Candidates"><FaUserTie /> {stats.totalCandidates}</span>
              <span>|</span>
              <span title="Recruiters"><FaBuilding /> {stats.totalRecruiters}</span>
            </div>
          </div>
        </motion.div>

        {/* Jobs Card */}
        <motion.div className="col-lg-3 col-md-6 col-12" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <div className="premium-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold text-uppercase">Published Offers</span>
              <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <FaBriefcase className="fs-5" />
              </div>
            </div>
            <h2 className="fw-bold display-6 mb-1">{stats.totalJobs}</h2>
            <div className="small text-success fw-bold">
              ● {stats.activeJobs} Active Offers
            </div>
          </div>
        </motion.div>

        {/* Applications Card */}
        <motion.div className="col-lg-3 col-md-6 col-12" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <div className="premium-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold text-uppercase">Submitted Apps</span>
              <div className="bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <FaFileAlt className="fs-5" />
              </div>
            </div>
            <h2 className="fw-bold display-6 mb-1">{stats.totalApplications}</h2>
            <div className="small text-muted">
              {stats.pendingApplications} Pending Review
            </div>
          </div>
        </motion.div>

        {/* Success Rate */}
        <motion.div className="col-lg-3 col-md-6 col-12" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <div className="premium-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small fw-bold text-uppercase">Acceptance Rate</span>
              <div className="bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <FaChartLine className="fs-5" />
              </div>
            </div>
            <h2 className="fw-bold display-6 mb-1">
              {stats.totalApplications > 0
                ? `${Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}%`
                : '0%'
              }
            </h2>
            <div className="small text-muted">
              {stats.acceptedApplications} Shortlisted applications
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail Analytics breakdowns */}
      <div className="row g-4">
        {/* User Distribution Chart */}
        <motion.div className="col-lg-6 col-12" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <div className="premium-card p-4 h-100">
            <h4 className="fw-bold font-heading mb-4">User Distribution</h4>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Application Status Chart */}
        <motion.div className="col-lg-6 col-12" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
          <div className="premium-card p-4 h-100">
            <h4 className="fw-bold font-heading mb-4">Application Reviews Pipeline</h4>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsPage;
