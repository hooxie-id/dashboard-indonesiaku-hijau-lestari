import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Alert, Dialog } from '../../Components/Alert';
import { getClassNames } from '../../Components/Constant';
import servicesMember from '../../Api/serviceMember';
import { token } from '../../Components/Constant';
import { useNavigate } from 'react-router-dom';
import { STORAGE_URL } from '../../Config/config';

const Member = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState(5);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [members, setMembers] = useState([]);
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await servicesMember.getAll(token);
            console.log(response);
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowImagePopup(true);
    };

    const handleClosePopup = () => {
        setShowImagePopup(false);
        setSelectedImage(null);
    };

    const handleAddClick = () => {
        navigate('/member/add');
    };

    const handleEdit = (id) => {
        navigate(`/member/edit/${id}`);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await servicesMember.delete(token, itemToDelete);
            setMembers(members.filter(member => member.id !== itemToDelete));
            console.log("Member deleted successfully");
        } catch (error) {
            console.error('Error deleting the member:', error);
        }
        setShowDialog(false);
        showAlertMessage('Data berhasil dihapus!');
    };

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
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

            {showImagePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`relative ${isDarkMode ? 'bg-slate-700' : 'bg-white'} rounded-lg p-2 md:p-4 w-full max-w-[95%] md:max-w-[85%] lg:max-w-3xl mx-auto`}>
                        <button
                            onClick={handleClosePopup}
                            className="absolute -top-12 right-2 md:right-0 text-white hover:text-gray-300 transition-colors duration-200 p-2"
                        >
                            <X size={24} />
                        </button>
                        <div className="w-full h-full">
                            <img
                                src={selectedImage || "/api/placeholder/400/320"}
                                alt="Preview"
                                className="w-full h-auto max-h-[50vh] md:max-h-[70vh] lg:max-h-[80vh] object-contain rounded-lg mx-auto"
                            />
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-4xl font-bold mb-2">Member</h1>
            <h2 className="text-2xl font-semibold mb-6">Daftar Member</h2>

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
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[20%]">Nama</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[15%]">Jabatan</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[15%]">KTA</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[15%]">Wilayah</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[10%]">Status</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[10%]">Gambar</th>
                            <th className="py-2 px-2 border border-gray-700 text-center font-normal w-[10%]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.slice(0, entries).map((member, index) => (
                            <tr key={member.id}>
                                <td className="py-2 px-2 text-center">{index + 1}</td>
                                <td className="py-2 px-2 text-center">{member.nama}</td>
                                <td className="py-2 px-2 text-center">{member.jabatan}</td>
                                <td className="py-2 px-2 text-center">{member.kta}</td>
                                <td className="py-2 px-2 text-center">{member.wilayah}</td>
                                <td className="py-2 px-2 text-center">{member.status}</td>
                                <td className="py-2 px-2 text-center">
                                    <button
                                        onClick={() => handleImageClick(STORAGE_URL + 'member_images/'+ member.image)}
                                        className={`${classNames.buttonBgColor} ${classNames.textColor} px-4 py-1.5 rounded hover:bg-opacity-80 transition-colors duration-200 flex items-center justify-center mx-auto text-sm`}
                                    >
                                        Lihat
                                    </button>
                                </td>
                                <td className="py-2 px-2 text-center">
                                    <button
                                        onClick={() => handleEdit(member.id)}
                                        className={`${classNames.buttonBgColor} ${classNames.textColor} hover:bg-yellow-500 hover:bg-opacity-50 px-3 py-1 rounded mr-2 text-xs`}
                                    >
                                        <span className='mr-1'>📝</span>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
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
                Tambah Member
            </button>
        </div>
    );
};

export default Member;
