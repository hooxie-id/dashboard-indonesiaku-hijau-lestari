import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Alert, Dialog } from '../../Components/Alert';
import { getClassNames } from '../../Components/Constant';
import servicesArtikel from '../../Api/serviceArtikel';
import { token } from '../../Components/Constant';
import { useNavigate } from 'react-router-dom';
import { STORAGE_URL } from '../../Config/config';

const Artikel = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await servicesArtikel.getAll(token);
            setArticles(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
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
        navigate('/artikel/add');
    };

    const handleEdit = (id) => {
        navigate(`/artikel/edit/${id}`);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await servicesArtikel.delete(token, itemToDelete);
            setArticles(articles.filter(article => article.id !== itemToDelete));
            showAlertMessage('Data berhasil dihapus!');
        } catch (error) {
            console.error('Error deleting the article:', error);
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

    // Filter and pagination logic
    const filteredArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastArticle = currentPage * entries;
    const indexOfFirstArticle = indexOfLastArticle - entries;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / entries);

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

            <h1 className="text-4xl font-bold mb-2">Artikel</h1>
            <h2 className="text-2xl font-semibold mb-6">Daftar Artikel</h2>

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
                    placeholder="Cari judul, konten..."
                    className={`p-2 rounded ${classNames.bgColor} ${classNames.textColor} border`}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden mb-6">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-center font-medium">No</th>
                            <th className="py-3 px-4 text-center font-medium">Judul</th>
                            <th className="py-3 px-4 text-center font-medium">Waktu Tambah/Edit</th>
                            <th className="py-3 px-4 text-center font-medium">Gambar</th>
                            <th className="py-3 px-4 text-center font-medium">Content</th>
                            <th className="py-3 px-4 text-center font-medium">Slug</th>
                            <th className="py-3 px-4 text-center font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentArticles.map((article, index) => (
                            <tr
                                key={article.id}
                                className="border-b last:border-b-0 even:bg-gray-100 odd:bg-white hover:bg-yellow-50 transition-all duration-200"
                            >
                                <td className="py-3 px-4 text-center text-gray-700">
                                    {indexOfFirstArticle + index + 1}
                                </td>
                                <td className="py-3 px-4 text-center text-gray-700">{article.title}</td>
                                <td className="py-3 px-4 text-center text-gray-700">{formatDate(article.created_at)}</td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => handleImageClick(STORAGE_URL + 'artikel_images/' + article.image)}
                                        className={`${classNames.buttonBgColor} ${classNames.textColor} px-4 py-1.5 rounded hover:bg-opacity-80 transition-colors duration-200 flex items-center justify-center mx-auto text-sm`}
                                    >
                                        Lihat
                                    </button>
                                </td>
                                <td className="py-3 px-4 text-center text-gray-700">
                                    {article.content.length > 12 ? `${article.content.slice(0, 12)}...` : article.content}
                                </td>
                                <td className="py-3 px-4 text-center text-gray-700">{article.slug}</td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => handleEdit(article.id)}
                                        className="mr-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
                                    >
                                        📝 Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
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
                Tambah Artikel
            </button>
        </div>
    );
};

export default Artikel;
