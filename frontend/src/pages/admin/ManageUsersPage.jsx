import React, { useState, useEffect } from 'react';
import { getAdminUsers, deleteAdminUser } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Failed to fetch users. Access restricted to Admin accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user account "${name}"? This will also remove all their profile data and cannot be undone.`)) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setSuccess(`User account "${name}" deleted successfully.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to delete user", err);
      setError("Failed to delete user account.");
    }
  };

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Retrieving registered user directories..." />;

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-3">
        <div>
          <h1 className="fw-bold font-heading display-5 mb-1">Manage Users</h1>
          <p className="text-secondary mb-0">Platform administrative oversight: review and delete candidate/recruiter accounts.</p>
        </div>

        <div className="col-md-4 col-12">
          <div className="input-group">
            <span className="input-group-text bg-white border-2 border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-2 border-start-0 ps-0" 
              placeholder="Search by name, email, or role..."
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
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">User Detail</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Email Account</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase text-center">System Role</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase">Registered On</th>
                <th className="py-3 px-4 text-secondary small fw-bold text-uppercase text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-secondary">
                    No users matching search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3.5 px-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          <i className={u.role === 'Candidate' ? "bi bi-mortarboard" : "bi bi-building"}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{u.name}</h6>
                          <small className="text-muted">ID: #{u.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-secondary small">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`badge border badge-premium ${u.role === 'Candidate' ? 'bg-primary-subtle text-primary border-primary-subtle' : 'bg-success-subtle text-success border-success-subtle'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-secondary small">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                      >
                        <i className="bi bi-trash"></i> Delete Account
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

export default ManageUsersPage;
