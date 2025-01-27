import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Alert, Dialog } from '../../Components/Alert';
import { getClassNames } from '../../Components/Constant';
import servicesMember from '../../Api/serviceMember';
import { token } from '../../Components/Constant';
import { useNavigate } from 'react-router-dom';
import { STORAGE_URL } from '../../Config/config';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
    MEMBER: 'member',
};

const Member = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await servicesMember.getAll(token);
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

    const moveMember = async (dragIndex, hoverIndex) => {
        const draggedMember = members[dragIndex];
        const updatedMembers = [...members];
        updatedMembers.splice(dragIndex, 1);
        updatedMembers.splice(hoverIndex, 0, draggedMember);
        setMembers(updatedMembers);

        try {
            await servicesMember.updateOrder(token, updatedMembers.map((member, index) => ({ id: member.id, order: index + 1 })));
            showAlertMessage('Order updated successfully!');
        } catch (error) {
            console.error('Error updating member order:', error);
        }
    };

    const filteredMembers = members.filter((member) =>
        member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.wilayah.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastMember = currentPage * entries;
    const indexOfFirstMember = indexOfLastMember - entries;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
    const totalPages = Math.ceil(filteredMembers.length / entries);

    return (
        <DndProvider backend={HTML5Backend}>
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
                        <div className={`relative ${isDarkMode ? 'bg-slate-700' : 'bg-white'} rounded-lg p-2 w-full max-w-3xl`}>
                            <button
                                onClick={handleClosePopup}
                                className="absolute -top-12 right-2 text-white hover:text-gray-300 transition-colors duration-200 p-2"
                            >
                                <X size={24} />
                            </button>
                            <img
                                src={selectedImage || "/api/placeholder/400/320"}
                                alt="Preview"
                                className="w-[500px] h-[500px] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}

                <h1 className="text-4xl font-bold mb-2">Member</h1>
                <h2 className="text-2xl font-semibold mb-6">Daftar Member</h2>

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
                        placeholder="Cari nama, jabatan, wilayah..."
                        className={`p-2 rounded ${classNames.bgColor} ${classNames.textColor} border`}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden mb-6">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-center font-medium">No</th>
                                <th className="py-3 px-4 text-center font-medium">Nama</th>
                                <th className="py-3 px-4 text-center font-medium">Jabatan</th>
                                <th className="py-3 px-4 text-center font-medium">KTA</th>
                                <th className="py-3 px-4 text-center font-medium">Wilayah</th>
                                <th className="py-3 px-4 text-center font-medium">Status</th>
                                <th className="py-3 px-4 text-center font-medium">Gambar</th>
                                <th className="py-3 px-4 text-center font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member, index) => (
                                <DraggableMember
                                    key={member.id}
                                    index={index}
                                    member={member}
                                    moveMember={moveMember}
                                    indexOfFirstMember={indexOfFirstMember}
                                    handleImageClick={handleImageClick}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    classNames={classNames}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center items-center">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {[...Array(totalPages).keys()].map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page + 1)}
                            className={`px-4 py-2 mx-1 rounded ${currentPage === page + 1 ? 'bg-yellow-500 text-white' : 'bg-gray-300'}`}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <button
                    onClick={handleAddClick}
                    className={`${classNames.buttonBgColor} ${classNames.textColor} py-2 px-4 mt-4 flex items-center rounded-full`}
                >
                    <PlusCircle size={20} className="mr-2" />
                    Tambah Member
                </button>
            </div>
        </DndProvider>
    );
};

const DraggableMember = ({ member, index, moveMember, indexOfFirstMember, handleImageClick, handleEdit, handleDelete, classNames }) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: ItemType.MEMBER,
        hover(item) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            moveMember(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType.MEMBER,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <tr
            ref={ref}
            className={`border-b last:border-b-0 even:bg-gray-100 odd:bg-white hover:bg-yellow-50 transition-all duration-200 ${isDragging ? 'opacity-50' : ''}`}
        >
            <td className="py-3 px-4 text-center text-gray-700">
                {indexOfFirstMember + index + 1}
            </td>
            <td className="py-3 px-4 text-center text-gray-700">{member.nama}</td>
            <td className="py-3 px-4 text-center text-gray-700">{member.jabatan}</td>
            <td className="py-3 px-4 text-center text-gray-700">{member.kta}</td>
            <td className="py-3 px-4 text-center text-gray-700">{member.wilayah}</td>
            <td className="py-3 px-4 text-center text-gray-700">{member.status}</td>
            <td className="py-3 px-4 text-center">
                <button
                    onClick={() => handleImageClick(STORAGE_URL + 'member_images/' + member.image)}
                    className={`${classNames.buttonBgColor} ${classNames.textColor} px-4 py-1.5 rounded hover:bg-opacity-80 transition-colors duration-200 flex items-center justify-center mx-auto text-sm`}
                >
                    Lihat
                </button>
            </td>
            <td className="py-3 px-4 text-center">
                <button
                    onClick={() => handleEdit(member.id)}
                    className="mr-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
                >
                    📝 Edit
                </button>
                <button
                    onClick={() => handleDelete(member.id)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                >
                    ❌ Hapus
                </button>
            </td>
        </tr>
    );
};

export default Member;