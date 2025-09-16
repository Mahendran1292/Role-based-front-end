import React, { useState, useEffect } from 'react';
import { getUserProfile, getAllUsers, updateUserProfile, getUserRole } from '../services/api';

const UserProfile = ({ onLogout }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const userRole = getUserRole();
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    fetchUserProfile();
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [isAdmin]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserProfile();
      
      if (data.message === 'User profile retrieved successfully') {
        setUserProfile(data.data);
        setEditData({
          name: data.data.name || '',
          phone: data.data.phone || '',
          dob: data.data.dob || '',
          profilePic: data.data.profilePic || ''
        });
      } else {
        setError('Failed to fetch user profile');
      }
    } catch (err) {
      setError('Error fetching profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setError('');
      const data = await getAllUsers();
      if (data.message === 'Users retrieved successfully') {
        setAllUsers(data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users: ' + err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = await updateUserProfile(editData);
      if (data.message === 'Profile updated successfully') {
        setSuccess('Profile updated successfully!');
        setUserProfile(data.data);
        setEditMode(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      
      <div className="profile-header">
        <h1>User Profile Management</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="profile-nav">
        <button
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
        {isAdmin && (
          <button
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            All Users
          </button>
        )}
      </div>

      {activeTab === 'profile' && userProfile && (
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>My Profile</h3>
            {!editMode && (
              <button
                className="btn btn-secondary"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="profile-info">
              <div className="profile-field">
                <strong>ID:</strong>
                <span>{userProfile.id}</span>
              </div>
              <div className="profile-field">
                <strong>Name:</strong>
                <span>{userProfile.name}</span>
              </div>
              <div className="profile-field">
                <strong>Email:</strong>
                <span>{userProfile.email}</span>
              </div>
              <div className="profile-field">
                <strong>Phone:</strong>
                <span>{userProfile.phone || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>Role:</strong>
                <span className={`role-badge ${userProfile.role.toLowerCase()}`}>
                  {userProfile.role}
                </span>
              </div>
              <div className="profile-field">
                <strong>Date of Birth:</strong>
                <span>{userProfile.dob || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>Profile Picture:</strong>
                {userProfile.profilePic ? (
                  <img
                    src={userProfile.profilePic}
                    alt="Profile"
                    className="profile-pic"
                    onError={(e) => { e.target.className = 'profile-pic-error'; e.target.alt = 'Image not found'; }}
                  />
                ) : (
                  <span>No image</span>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth (YYYY-MM-DD):</label>
                <input
                  type="text"
                  name="dob"
                  value={editData.dob}
                  onChange={handleInputChange}
                  pattern="^\d{4}-\d{2}-\d{2}$"
                  placeholder="1990-01-15"
                />
              </div>

              <div className="form-group">
                <label>Profile Picture URL:</label>
                <input
                  type="url"
                  name="profilePic"
                  value={editData.profilePic}
                  onChange={handleInputChange}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'users' && isAdmin && (
        <div className="profile-card">
          <h3>All Users</h3>
          {allUsers.length > 0 ? (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>DOB</th>
                    <th>Profile Pic</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.dob || 'N/A'}</td>
                      <td>
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt="Profile"
                            className="table-profile-pic"
                            onError={(e) => {
                              e.target.className = 'table-profile-pic-error';
                              e.target.alt = 'No image';
                            }}
                          />
                        ) : (
                          <span className="no-image">No image</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;


