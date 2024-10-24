import React, { useState, useRef } from "react";
import { getClassNames } from "../../Components/Constant";
import servicesMember from "../../Api/serviceMember"; // Update to member services
import { token } from "../../Components/Constant";
import servicesAuth from "../../Api/serviceAuth"; // For verifying token

const AddMember = ({ isDarkMode }) => {
    const [memberData, setMemberData] = useState({
        nama: '',
        jabatan: '',
        kta: '',
        wilayah: '',
        status: '', // Keep this as is; we'll handle it with a dropdown
        image: null,
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const classNames = getClassNames(isDarkMode);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMemberData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const showAlertMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validation: Ensure required fields are filled
        if (!memberData.nama || !memberData.jabatan || !memberData.kta || !memberData.wilayah || !memberData.status) {
            setError('Semua field harus diisi!');
            return;
        }

        const response = await servicesAuth.verifyToken(token);
        const author = response.data.id;

        const formData = new FormData();

        // Append member data to formData
        formData.append('nama', memberData.nama);
        formData.append('jabatan', memberData.jabatan);
        formData.append('kta', memberData.kta);
        formData.append('wilayah', memberData.wilayah);
        formData.append('status', memberData.status);
        formData.append('author_id', author);

        if (memberData.image) {
            formData.append('image', memberData.image);
        }

        try {
            const response = await servicesMember.create(token, formData); // Save member data using the service
            console.log("API Response:", response);
            showAlertMessage('Data berhasil disimpan!');
            setMemberData({
                nama: '',
                jabatan: '',
                kta: '',
                wilayah: '',
                status: '',
                image: null
            });
        } catch (error) {
            console.error("Error saving member:", error);
            showAlertMessage(error.message || 'Failed to save member');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMemberData(prev => ({ ...prev, image: file }));
        }
    };

    const handleChooseFile = () => fileInputRef.current.click();

    return (
        <div className={`${classNames.bgColor} ${classNames.textColor} h-screen w-1/2 p-8 flex`}>
            <div className="flex flex-col w-full">
                <h1 className="text-4xl font-bold mb-2">Tambah Member</h1>
                {showAlert && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{alertMessage}</span>
                    </div>
                )}
                <div className="flex flex-grow">
                    <div className="w-full flex-none">
                        <form onSubmit={handleSave} className={`${classNames.bgColor} py-6 rounded-lg`}>
                            <div className="mb-4">
                                <label className="block mb-2">Nama</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={memberData.nama}
                                    placeholder="Nama member"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Jabatan</label>
                                <input
                                    type="text"
                                    name="jabatan"
                                    value={memberData.jabatan}
                                    placeholder="Jabatan member"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">KTA</label>
                                <input
                                    type="text"
                                    name="kta"
                                    value={memberData.kta}
                                    placeholder="Nomor KTA"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Wilayah</label>
                                <input
                                    type="text"
                                    name="wilayah"
                                    value={memberData.wilayah}
                                    placeholder="Wilayah member"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Status</label>
                                <select
                                    name="status"
                                    value={memberData.status}
                                    onChange={handleInputChange}
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
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
                                {memberData.image && (
                                    <img
                                        src={URL.createObjectURL(memberData.image)}
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

export default AddMember;
