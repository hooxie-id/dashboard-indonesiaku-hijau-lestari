import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { LogoutConfirmationAlert, LogoutSuccessAlert } from '../Components/Alert';
import servicesProfile from '../Api/serviceProfile';
import { useNavigate } from 'react-router-dom';
import { token } from '../Components/Constant';
import servicesAuth from '../Api/serviceAuth';

const Profile = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
    const buttonBgColor = 'bg-red-800';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await servicesAuth.verifyToken(token);

                if (response && response.data) {
                    setUserId(response.data.id);
                } else {
                    console.error('Invalid token or user data:', response.message);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                window.location.reload();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const response = await servicesProfile.getById(token, userId);
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                setErrorMessage('Failed to fetch user profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleLogout = () => {
        setShowLogoutAlert(true);
    };

    const confirmLogout = async (e) => {
        e.preventDefault();

        try {
            await servicesAuth.logout(token);
            localStorage.clear();
            setShowSuccessAlert(true);
            setShowLogoutAlert(false);
            setMessage('Logout successful');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred during logout. Please try again.';
            setMessage(errorMessage);
            setShowLogoutAlert(false);
        }
    };

    const cancelLogout = () => {
        setShowLogoutAlert(false);
    };

    const handleSuccessClose = () => {
        setShowSuccessAlert(false);
    };

    const handleProfileUpdate = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            await servicesProfile.update(token, userId, { name, email });
            alert('Profile updated successfully!');
        } catch (error) {
            setErrorMessage('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('New password and confirmation do not match.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        try {
            await servicesProfile.updatePassword(token, userId, {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmNewPassword,
            });

            alert('Password updated successfully!');

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            setErrorMessage('Failed to update password. Please check your current password.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${bgColor} ${textColor} flex justify-center items-center`}>
                <div className="loader">Loading...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} flex justify-center mt-4`}>
            <div className="w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mt-10">
                {message && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}
                <button
                    className={`w-full ${buttonBgColor} text-white p-2 rounded-md mb-4 flex items-center justify-center`}
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2" />
                    Logout
                </button>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md p-4 mb-4 border ${borderColor}`}>
                    <h2 className="text-xl font-bold mb-4">Informasi Pengguna</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Nama</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor} border ${borderColor}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor} border ${borderColor}`}
                        />
                    </div>
                    <button
                        className={`w-full bg-gray-600 text-white p-2 rounded-md`}
                        onClick={handleProfileUpdate}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Simpan'}
                    </button>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md p-4 border ${borderColor}`}>
                    <h2 className="text-xl font-bold mb-4">Ubah Password</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor} border ${borderColor}`}
                            placeholder="Current Password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor} border ${borderColor}`}
                            placeholder="New Password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor} border ${borderColor}`}
                            placeholder="Confirm New Password"
                        />
                    </div>
                    <button
                        className={`w-full bg-gray-600 text-white p-2 rounded-md`}
                        onClick={handlePasswordUpdate}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Simpan'}
                    </button>
                </div>
            </div>

            {showLogoutAlert && (
                <LogoutConfirmationAlert
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}

            {showSuccessAlert && (
                <LogoutSuccessAlert
                    onClose={handleSuccessClose}
                />
            )}
        </div>
    );
};

export default Profile;
