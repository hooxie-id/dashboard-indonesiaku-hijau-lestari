import React, { useState, useEffect } from "react";
import { getClassNames } from "../../Components/Constant";
import servicesUser from "../../Api/serviceUser"; // Update the import to your user service
import { token } from "../../Components/Constant";
import { useParams } from "react-router-dom";

const EditUser = ({ isDarkMode }) => {
    const { id } = useParams();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '' // Added confirmPassword field
    });
    const [initialData, setInitialData] = useState(null); // Store the initial data
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailedAlert, setShowFailedAlert] = useState(false);
    const [alertSuccessMessage, setAlertSuccessMessage] = useState('');
    const [alertFailedMessage, setAlertFailedMessage] = useState('');
    const [error, setError] = useState({}); // Changed to an object to hold multiple error messages
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await servicesUser.getById(token, id);
                const { name, email } = response.data;

                const initialUserData = {
                    name,
                    email,
                    password: '', // Initialize password as empty
                    confirmPassword: '' // Initialize confirmPassword as empty
                };

                setUserData(initialUserData);
                setInitialData(initialUserData);
            } catch (error) {
                console.error('Error fetching user:', error);
                showAlertFailedMessage('Failed to fetch user data.');
            }
        };

        fetchUserData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
        setError(prevError => ({ ...prevError, [name]: '' })); // Clear error for the current field
    };

    const showAlertSuccessMessage = (message) => {
        setAlertSuccessMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const showAlertFailedMessage = (message) => {
        setAlertFailedMessage(message);
        setShowFailedAlert(true);
        setTimeout(() => setShowFailedAlert(false), 3000);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const newError = {};

        if (!userData.name) newError.name = 'Name harus diisi!'; // Validate name
        if (!userData.email) newError.email = 'Email harus diisi!';
        if (!userData.password) newError.password = 'Password harus diisi!'; // Validate password
        if (userData.password !== userData.confirmPassword) newError.confirmPassword = 'Password tidak cocok!'; // Validate confirm password

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        const formData = new FormData();
        const isDataChanged =
            userData.name !== initialData.name ||
            userData.email !== initialData.email ||
            userData.password !== initialData.password; // Check if any field is changed

        if (isDataChanged) {
            formData.append('name', userData.name); // Append name to form data
            formData.append('email', userData.email);
            formData.append('password', userData.password); // Append password to form data
            formData.append('_method', 'put');

            try {
                const response = await servicesUser.update(token, id, formData);
                console.log("API Response:", response);
                showAlertSuccessMessage('Data berhasil diperbarui!');
                setInitialData(userData);
            } catch (error) {
                console.error("Error updating user:", error);
                showAlertFailedMessage(error.message || 'Failed to update user');
            }
        } else {
            showAlertSuccessMessage('No changes detected!');
        }
    };

    return (
        <div className={`${classNames.bgColor} ${classNames.textColor} h-screen w-1/2 p-8 flex`}>
            <div className="flex flex-col w-full">
                <h1 className="text-4xl font-bold mb-2">Edit User</h1>

                {showSuccessAlert && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{alertSuccessMessage}</span>
                    </div>
                )}

                {showFailedAlert && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{alertFailedMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="flex flex-grow">
                    <div className="flex-1">
                        <div className={`${classNames.bgColor} py-6 rounded-lg h-full`}>
                            <div className="mb-4">
                                <label className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name" // Changed to name
                                    value={userData.name}
                                    placeholder="Name"
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
                                    placeholder="Email"
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
                                    placeholder="Password"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error.password && <p className="text-red-500 text-sm mb-2">{error.password}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Confirm Password</label> {/* Added confirm password field */}
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={userData.confirmPassword} // Bind confirm password
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
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
