import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { LogoutConfirmationAlert, LogoutSuccessAlert } from '../Components/Alert';

const Profile = ({ isDarkMode }) => {
    const [name, setName] = useState('admin');
    const [email, setEmail] = useState('admin@gmail.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
    const buttonBgColor = 'bg-red-800';

    const handleLogout = () => {
        setShowLogoutAlert(true);
    };

    const confirmLogout = () => {
        setShowLogoutAlert(false);
        setShowSuccessAlert(true);
    };

    const cancelLogout = () => {
        setShowLogoutAlert(false);
    };

    const handleSuccessClose = () => {
        setShowSuccessAlert(false);
        console.log("User logged out");
    };

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} flex justify-center mt-4`}>
            <div className="w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 mt-10">
                <button
                    className={`w-full ${buttonBgColor} text-white p-2 rounded-md mb-4 flex items-center justify-center`}
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2" />
                    Logout
                </button>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md p-4 mb-4`}>
                    <h2 className="text-xl font-bold mb-4">Informasi Pengguna</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Nama</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor}`}
                        />
                    </div>
                    <button className={`w-full bg-gray-600 text-white p-2 rounded-md`}>
                        Simpan
                    </button>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md p-4`}>
                    <h2 className="text-xl font-bold mb-4">Ubah Password</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor}`}
                            placeholder="Value"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor}`}
                            placeholder="Value"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className={`w-full p-2 rounded-md ${inputBgColor} ${textColor}`}
                            placeholder="Value"
                        />
                    </div>
                    <button className={`w-full bg-gray-600 text-white p-2 rounded-md`}>
                        Simpan
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