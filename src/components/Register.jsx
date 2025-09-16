import React, { useState } from 'react';
import { register } from '../services/api';

const Register = ({ switchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: 'USER',
        dob: '',
        profilePic: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        setRegistrationStatus('');

        try {
            const { response, data } = await register(formData);

            if (response.ok && data.message === 'User registered successfully') {
                setSuccess('Registration successful! You can now login.');
                setRegistrationStatus('Registration completed successfully. Please use your credentials to login.');
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    password: '',
                    role: 'USER',
                    dob: '',
                    profilePic: ''
                });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <h2 className="auth-title">Register</h2>

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

                {registrationStatus && (
                    <div className="registration-status">
                        <strong>Status:</strong> {registrationStatus}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            minLength="2"
                            maxLength="50"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+1234567890"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth (YYYY-MM-DD):</label>
                        <input
                            type="text"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            pattern="^\d{4}-\d{2}-\d{2}$"
                            placeholder="1990-01-15"
                        />
                    </div>

                    <div className="form-group">
                        <label>Profile Picture URL:</label>
                        <input
                            type="url"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/profile.jpg"
                        />
                        <small className="form-help">
                            Must be a valid image URL ending with jpg, jpeg, png, gif, bmp, or webp
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Role:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="auth-switch">
                    Already have an account?
                    <button
                        onClick={switchToLogin}
                        className="auth-switch-btn"
                    >
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;


