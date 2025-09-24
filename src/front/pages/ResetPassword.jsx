import React, { useState } from "react";
import "./ResetPassword.css";
import "./LoginSignup.css";

const ResetPassword = ({ userId }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        console.log("Submitting password reset with:", {
            user_id: userId,
            current_password: currentPassword,
            new_password: newPassword,
        });

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('https://friendly-computing-machine-pxw4p4r46rq2r7gp-3001.app.github.dev/api/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (response.ok) {
                setMessage(data.msg || "Password updated");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                const errorMsg = data.msg || "Failed to reset password";
                setError(errorMsg);
                console.error("Password reset failed:", errorMsg, data);
            }
        } catch (err) {
            setError("Server error: " + err.message);
            console.error("Exception during password reset:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <h2 className="reset-password-title">Change Password</h2>
            <div className="reset-password-box">
                {message && <div className="reset-password-success">{message}</div>}
                {error && <div className="reset-password-error">{error}</div>}
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <input
                        type="password"
                        placeholder="Current Password"
                        className="reset-password-input"
                        value={currentPassword}
                        onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            setError(null); // Clear error on input change
                        }}
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        className="reset-password-input"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setError(null);
                        }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="reset-password-button"
                    >
                        {loading ? "Resetting..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
