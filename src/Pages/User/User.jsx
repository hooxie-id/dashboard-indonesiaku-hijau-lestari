import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Alert, Dialog } from '../../Components/Alert';
import { getClassNames } from '../../Components/Constant';
import servicesUser from '../../Api/serviceUser';
import { token } from '../../Components/Constant';
import { useNavigate } from 'react-router-dom';

const User = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // For search
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await servicesUser.getAll(token);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddClick = () => {
        navigate('/user/add');
    };

    const handleEdit = (id) => {
        navigate(`/user/edit/${id}`);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await servicesUser.delete(token, itemToDelete);
            setUsers(users.filter(user => user.id !== itemToDelete));
            showAlertMessage('Data berhasil dihapus!');
        } catch (error) {
            console.error('Error deleting the user:', error);
        }
        setShowDialog(false);
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

    // Pagination logic
    const indexOfLastUser = currentPage * entries;
    const indexOfFirstUser = indexOfLastUser - entries;
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / entries);

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

            {/* Search and Entries Selector */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="mr-2">Tampilkan</span>
                    <select
                        className={`${classNames.bgColor} ${classNames.textColor} p-2 rounded`}
                        value={entries}
                        onChange={(e) => {
                            setEntries(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                    <span className="ml-2">entri</span>
                </div>

                <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    className={`p-2 rounded ${classNames.bgColor} ${classNames.textColor} border border-gray-300`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden mb-6">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-center font-medium">No</th>
                            <th className="py-3 px-4 text-center font-medium">Nama</th>
                            <th className="py-3 px-4 text-center font-medium">Email</th>
                            <th className="py-3 px-4 text-center font-medium">Created At</th>
                            <th className="py-3 px-4 text-center font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr
                                key={user.id}
                                className="border-b last:border-b-0 even:bg-gray-100 odd:bg-white hover:bg-yellow-100 transition-all duration-200"
                            >
                                <td className="py-3 px-4 text-center text-gray-700">{indexOfFirstUser + index + 1}</td>
                                <td className="py-3 px-4 text-center text-gray-700">{user.name}</td>
                                <td className="py-3 px-4 text-center text-gray-700">{user.email}</td>
                                <td className="py-3 px-4 text-center text-gray-700">{formatDate(user.created_at)}</td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => handleEdit(user.id)}
                                        className="text-blue-600 hover:text-blue-800 font-medium mr-3 transition duration-200"
                                    >
                                        📝 Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                                    >
                                        ❌ Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mx-1 rounded ${classNames.buttonBgColor} ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                >
                    Previous
                </button>

                {[...Array(totalPages).keys()].map((page) => (
                    <button
                        key={page + 1}
                        onClick={() => setCurrentPage(page + 1)}
                        className={`px-4 py-2 mx-1 rounded ${currentPage === page + 1 ? 'bg-yellow-500 text-white' : classNames.buttonBgColor}`}
                    >
                        {page + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 mx-1 rounded ${classNames.buttonBgColor} ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                >
                    Next
                </button>
            </div>

            {/* Add User Button */}
            <button
                onClick={handleAddClick}
                className={`${classNames.buttonBgColor} ${classNames.textColor} py-2 px-4 flex items-center hover:bg-yellow-500 hover:bg-opacity-50 rounded-full mt-4`}
            >
                <PlusCircle size={20} className="mr-2" />
                Tambah User
            </button>
        </div>
    );
};

export default User;
