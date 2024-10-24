import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Alert, Dialog } from '../../Components/Alert';
import { getClassNames } from '../../Components/Constant';
import servicesUser from '../../Api/serviceUser'; // Renamed to servicesUser
import { token } from '../../Components/Constant';
import { useNavigate } from 'react-router-dom';

const User = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState(5);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [users, setUsers] = useState([]); // Changed to users
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await servicesUser.getAll(token);
            console.log(response);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddClick = () => {
        navigate('/user/add'); // Updated to /user
    };

    const handleEdit = (id) => {
        navigate(`/user/edit/${id}`); // Updated to /user
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await servicesUser.delete(token, itemToDelete); // Renamed to servicesUser
            setUsers(users.filter(user => user.id !== itemToDelete)); // Updated to users
            console.log("User deleted successfully");
        } catch (error) {
            console.error('Error deleting the user:', error);
        }
        setShowDialog(false);
        showAlertMessage('Data berhasil dihapus!');
    };

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className={`${classNames.bgColor} ${classNames.textColor} p-6 min-h-screen relative`}>
            {showAlert && <Alert message={alertMessage} onClose={() => setShowAlert(false)} />}

            <Dialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={confirmDelete}
                title="Yakin untuk menghapus?"
            />

            <h1 className="text-4xl font-bold mb-2">User</h1>
            <h2 className="text-2xl font-semibold mb-6">Daftar User</h2>

            <div className="mb-4 flex items-center">
                <span className="mr-2">Tampilkan</span>
                <select
                    className={`${classNames.bgColor} ${classNames.textColor} p-2 rounded`}
                    value={entries}
                    onChange={(e) => setEntries(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
                <span className="ml-2">entri</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-6">
                    <thead>
                        <tr className="border border-gray-700">
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[5%]">No</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[30%]">Nama</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[40%]">Email</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[15%]">Created At</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[10%]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.slice(0, entries).map((user, index) => (
                            <tr key={user.id}>
                                <td className="py-2 px-2 text-center">{index + 1}</td>
                                <td className="py-2 px-2 text-center">{user.name}</td>
                                <td className="py-2 px-2 text-center">{user.email}</td>
                                <td className="py-2 px-2 text-center">{formatDate(user.created_at)}</td>
                                <td className="py-2 px-2 text-center">
                                    <button
                                        onClick={() => handleEdit(user.id)}
                                        className={`${classNames.buttonBgColor} ${classNames.textColor} hover:bg-yellow-500 hover:bg-opacity-50 px-3 py-1 rounded mr-2 text-xs`}
                                    >
                                        <span className='mr-1'>📝</span>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className={`${classNames.buttonBgColor} ${classNames.textColor} hover:bg-yellow-500 hover:bg-opacity-50 px-3 py-1 rounded text-xs`}
                                    >
                                        <span className='mr-1'>❌</span>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={handleAddClick}
                className={`${classNames.buttonBgColor} ${classNames.textColor} py-2 px-4 flex items-center hover:bg-yellow-500 hover:bg-opacity-50 rounded-full`}
            >
                <PlusCircle size={20} className="mr-2" />
                Tambah User
            </button>
        </div>
    );
};

export default User;
