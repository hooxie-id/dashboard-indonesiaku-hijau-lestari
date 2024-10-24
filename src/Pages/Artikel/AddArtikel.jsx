import React, { useState, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { getClassNames } from "../../Components/Constant";
import servicesArtikel from "../../Api/serviceArtikel";
import { token } from "../../Components/Constant";
import servicesAuth from "../../Api/serviceAuth";

const AddArtikel = ({ isDarkMode }) => {
    const [articleData, setArticleData] = useState({
        title: '',
        image: null,
        content: '',
        slug: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const classNames = getClassNames(isDarkMode);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedArticleData = { ...articleData, [name]: value };

        if (name === 'title') {
            updatedArticleData.slug = generateSlug(value);
        }

        setArticleData(updatedArticleData);
        setError('');
    };

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!articleData.title || !articleData.content) {
            setError('Title dan Konten harus diisi!');
            return;
        }

        const response = await servicesAuth.verifyToken(token);
        const author = response.data.id;

        const formData = new FormData();

        formData.append('title', articleData.title);
        formData.append('slug', articleData.slug);
        formData.append('content', articleData.content);
        formData.append('author_id', author);

        if (articleData.image) {
            formData.append('image', articleData.image);
        }

        try {
            const response = await servicesArtikel.create(token, formData);
            console.log("API Response:", response);
            showAlertMessage('Data berhasil disimpan!');
            setArticleData({ title: '', image: null, content: '', slug: '' });
        } catch (error) {
            console.error("Error saving article:", error);
            showAlertMessage(error.message || 'Failed to save article');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setArticleData(prev => ({ ...prev, image: file }));
            reader.readAsDataURL(file);
        }
    };

    const handleChooseFile = () => fileInputRef.current.click();

    const handleContentChange = (content) => {
        setArticleData(prev => ({ ...prev, content }));
    };

    return (
        <div className={`${classNames.bgColor} ${classNames.textColor} h-screen w-fit p-8 flex`}>
            <div className="flex flex-col w-full">
                <h1 className="text-4xl font-bold mb-2">Tambah Artikel</h1>
                {showAlert && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{alertMessage}</span>
                    </div>
                )}
                <div className="flex flex-grow">
                    <div className="flex-1 pr-4">
                        <div className={`${classNames.bgColor} py-6 rounded-lg h-full`}>
                            <div className="mb-4">
                                <label className="block mb-2">Konten</label>
                                <Editor
                                    apiKey='a2k2kudtwwpqcx67oeeolwlri3t7q1ywzs753smm3u0wn2og'
                                    value={articleData.content}
                                    init={{
                                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                        height: "600px" // Increased height for the content editor
                                    }}
                                    onEditorChange={handleContentChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-fit pl-4 flex-none">
                        <form onSubmit={handleSave} className={`${classNames.bgColor} py-6 rounded-lg`}>
                            <div className="mb-4">
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={articleData.title}
                                    placeholder="Title artikel"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Slug</label>
                                <input
                                    disabled
                                    type="text"
                                    name="slug"
                                    value={articleData.slug}
                                    placeholder="Slug artikel"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Image</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={handleChooseFile}
                                    className={`${classNames.buttonBgColor} ${classNames.textColor} py-2 px-4 rounded`}
                                >
                                    Choose File
                                </button>
                                {articleData.image && (
                                    <img
                                        src={URL.createObjectURL(articleData.image)}
                                        alt="Preview"
                                        className="mt-2 max-w-xs max-h-32 object-contain"
                                    />
                                )}
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

export default AddArtikel;
