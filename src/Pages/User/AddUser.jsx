import React, { useState } from "react";
import { getClassNames } from "../../Components/Constant";
import servicesUser from "../../Api/serviceUser";
import { token } from "../../Components/Constant";

const AddUser = ({ isDarkMode }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState({});
    const classNames = getClassNames(isDarkMode);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        setError(prev => ({ ...prev, [name]: '' }));
    };

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const newError = {};
        if (!userData.name) newError.name = 'Name harus diisi!';
        if (!userData.email) newError.email = 'Email harus diisi!';
        if (!userData.password) newError.password = 'Password harus diisi!';
        if (userData.password !== userData.confirmPassword) newError.confirmPassword = 'Password tidak cocok!';

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        const formData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
        };

        try {
            const response = await servicesUser.create(token, formData);
            console.log("API Response:", response);
            showAlertMessage('Data berhasil disimpan!');
            setUserData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error("Error saving user:", error);
            showAlertMessage(error.message || 'Failed to save user');
        }
    };

    return (
        <div className={`${classNames.bgColor} ${classNames.textColor} h-screen w-1/2 p-8 flex`}>
            <div className="flex flex-col w-full">
                <h1 className="text-4xl font-bold mb-2">Tambah User</h1>
                {showAlert && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{alertMessage}</span>
                    </div>
                )}
                <div className="flex flex-grow">
                    <div className="w-full flex-none">
                        <form onSubmit={handleSave} className={`${classNames.bgColor} py-6 rounded-lg`}>
                            <div className="mb-4">
                                <label className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    placeholder="User name"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error.name && <p className="text-red-500 text-sm mb-2">{error.name}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    placeholder="User email"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error.email && <p className="text-red-500 text-sm mb-2">{error.email}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password}
                                    placeholder="User password"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error.password && <p className="text-red-500 text-sm mb-2">{error.password}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={userData.confirmPassword}
                                    placeholder="Confirm Password"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error.confirmPassword && <p className="text-red-500 text-sm mb-2">{error.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                className={`${classNames.buttonBgColor} ${classNames.textColor} w-full py-2 rounded hover:bg-opacity-80 mt-4`}
                            >
                                Simpan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
