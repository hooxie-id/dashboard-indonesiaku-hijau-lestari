import React, { useState, useEffect, useRef } from "react";
import { getClassNames } from "../../Components/Constant";
import servicesMember from "../../Api/serviceMember"; // Update the import to your member service
import { token } from "../../Components/Constant";
import { useParams } from "react-router-dom";
import { STORAGE_URL } from '../../Config/config';

const EditMember = ({ isDarkMode }) => {
    const { id } = useParams();
    const [memberData, setMemberData] = useState({
        nama: '',
        jabatan: '',
        kta: '',
        wilayah: '',
        status: '',
        image: null
    });
    const [initialData, setInitialData] = useState(null); // Store the initial data
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showFailedAlert, setShowFailedAlert] = useState(false);
    const [alertSuccessMessage, setAlertSuccessMessage] = useState('');
    const [alertFailedMessage, setAlertFailedMessage] = useState('');
    const [error, setError] = useState({}); // Changed to an object to hold multiple error messages
    const fileInputRef = useRef(null);
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                const response = await servicesMember.getById(token, id);
                const { nama, jabatan, kta, wilayah, status, image } = response.data;

                const initialMemberData = {
                    nama,
                    jabatan,
                    kta,
                    wilayah,
                    status,
                    image: image ? image : null
                };

                setMemberData(initialMemberData);
                setInitialData(initialMemberData);
            } catch (error) {
                console.error('Error fetching member:', error);
                showAlertFailedMessage('Failed to fetch member data.');
            }
        };

        fetchMemberData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMemberData(prevData => ({ ...prevData, [name]: value }));
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

        if (!memberData.nama) newError.nama = 'Nama harus diisi!';
        if (!memberData.jabatan) newError.jabatan = 'Jabatan harus diisi!';
        if (!memberData.kta) newError.kta = 'KTA harus diisi!';
        if (!memberData.wilayah) newError.wilayah = 'Wilayah harus diisi!';
        if (!memberData.status) newError.status = 'Status harus diisi!';

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        const formData = new FormData();
        const isImageChanged = memberData.image !== initialData.image;

        if (memberData.nama !== initialData.nama) {
            formData.append('nama', memberData.nama);
        }
        if (memberData.jabatan !== initialData.jabatan) {
            formData.append('jabatan', memberData.jabatan);
        }
        if (memberData.kta !== initialData.kta) {
            formData.append('kta', memberData.kta);
        }
        if (memberData.wilayah !== initialData.wilayah) {
            formData.append('wilayah', memberData.wilayah);
        }
        if (memberData.status !== initialData.status) {
            formData.append('status', memberData.status);
        }
        if (isImageChanged && memberData.image) {
            formData.append('image', memberData.image);
        }

        formData.append('_method', 'put');

        if (formData.has('nama') || formData.has('jabatan') || formData.has('kta') || formData.has('wilayah') || formData.has('status') || isImageChanged) {
            try {
                const response = await servicesMember.update(token, id, formData);
                console.log("API Response:", response);
                showAlertSuccessMessage('Data berhasil diperbarui!');
                setInitialData(memberData);
            } catch (error) {
                console.error("Error updating member:", error);
                showAlertFailedMessage(error.message || 'Failed to update member');
            }
        } else {
            showAlertSuccessMessage('No changes detected!');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setMemberData(prev => ({ ...prev, image: file }));
            reader.readAsDataURL(file);
        }
    };

    const handleChooseFile = () => fileInputRef.current.click();

    return (
        <div className={`${classNames.bgColor} ${classNames.textColor} h-screen w-1/2 p-8 flex`}>
            <div className="flex flex-col w-full">
                <h1 className="text-4xl font-bold mb-2">Edit Member</h1>

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
                                <label className="block mb-2">Nama</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={memberData.nama}
                                    placeholder="Nama member"
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                />
                                {error.nama && <p className="text-red-500 text-sm mb-2">{error.nama}</p>}
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
                                {error.jabatan && <p className="text-red-500 text-sm mb-2">{error.jabatan}</p>}
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
                                {error.kta && <p className="text-red-500 text-sm mb-2">{error.kta}</p>}
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
                                {error.wilayah && <p className="text-red-500 text-sm mb-2">{error.wilayah}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Status</label>
                                <select
                                    name="status"
                                    value={memberData.status}
                                    className={`${classNames.inputBgColor} ${classNames.textColor} w-full p-2 rounded border border-gray-600`}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled hidden>Select Status</option> {/* Unselectable placeholder */}
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                {error.status && <p className="text-red-500 text-sm mb-2">{error.status}</p>}
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
                                        src={typeof memberData.image === 'string' ? STORAGE_URL + 'member_images/' + memberData.image : URL.createObjectURL(memberData.image)}
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
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMember;
