import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Profile.css";

function Profile() {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedLastName, setEditedLastName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData') || localStorage.getItem('userProfile');
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                setUserData(parsedData);
                setEditedFirstName(parsedData.firstName || '');
                setEditedLastName(parsedData.lastName || '');
            } catch {
                setError('Failed to load user data');
            }
        } else {
            setError('No user data found');
        }
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setEditedFirstName(userData.firstName || '');
            setEditedLastName(userData.lastName || '');
        }
        setIsEditing(!isEditing);
    };

    const handleSaveName = () => {
        const updatedUserData = {
            ...userData,
            firstName: editedFirstName,
            lastName: editedLastName
        };
        setUserData(updatedUserData);
        localStorage.setItem('userProfile', JSON.stringify(updatedUserData));
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setIsEditing(false);
        window.dispatchEvent(new Event('storage'));
    };

    const compressImage = (file, maxWidth = 200, quality = 0.7) => new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;
            if (width > maxWidth) height = (height * maxWidth) / width, width = maxWidth;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };
        img.src = URL.createObjectURL(file);
    });

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            compressImage(file, 200, 0.7).then(compressedFile => {
                const reader = new FileReader();
                reader.onload = function (readerEvent) {
                    const base64Photo = readerEvent.target.result;
                    const updatedUserData = { ...userData, profilePicture: base64Photo };
                    setUserData(updatedUserData);
                    localStorage.setItem('userProfile', JSON.stringify(updatedUserData));
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));
                    window.dispatchEvent(new Event('storage'));
                };
                reader.readAsDataURL(compressedFile);
            });
        }
    };

    if (loading) return <div className="profile-loading">Loading...</div>;
    if (error) return <div className="profile-error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile</h1>
            </div>
            <div className="profile-card">
                <div className="profile-info">
                    <div className="profile-picture-section">
                        <div className="profile-picture-container">
                            {userData.profilePicture ? (
                                <img src={userData.profilePicture} alt="Profile" className="profile-picture" />
                            ) : (
                                <div className="profile-picture-placeholder">
                                    {userData.firstName && userData.lastName ? `${userData.firstName[0]}${userData.lastName[0]}` : '👤'}
                                </div>
                            )}
                            <label htmlFor="profile-pic-upload" className="profile-picture-upload-btn">+</label>
                            <input
                                id="profile-pic-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    <h2>Welcome, {userData.firstName} {userData.lastName}!</h2>
                    <div className="profile-details">
                        <div className="profile-field">
                            <label>First Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedFirstName}
                                    onChange={(e) => setEditedFirstName(e.target.value)}
                                    className="profile-edit-input"
                                />
                            ) : (
                                <span>{userData.firstName}</span>
                            )}
                        </div>
                        <div className="profile-field">
                            <label>Last Name:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedLastName}
                                    onChange={(e) => setEditedLastName(e.target.value)}
                                    className="profile-edit-input"
                                />
                            ) : (
                                <span>{userData.lastName}</span>
                            )}
                        </div>
                        <div className="profile-field">
                            <label>Email:</label>
                            <span>{userData.email}</span>
                        </div>
                        {userData.signupDate && (
                            <div className="profile-field">
                                <label>Member Since:</label>
                                <span>{new Date(userData.signupDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                    <div className="profile-actions">
                        {isEditing ? (
                            <div className="edit-actions">
                                <button onClick={handleSaveName} className="save-button">Save</button>
                                <button onClick={handleEditToggle} className="cancel-button">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={handleEditToggle} className="edit-button">Edit Name</button>
                        )}
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                        <a href="/resetpassword" className="reset-password-link">Reset Password</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;