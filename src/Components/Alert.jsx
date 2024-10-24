import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const LogoutConfirmationAlert = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 h-40">
            <h2 className="text-xl font-semibold mb-4 text-center text-black mt-4">Yakin untuk logout?</h2>
            <div className="flex justify-between mt-8">
                <button
                    onClick={onConfirm}
                    className="bg-red-600 text-white px-4 py-2 rounded-md w-[48%]"
                >
                    Ya
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md w-[48%]"
                >
                    Tidak
                </button>
            </div>
        </div>
    </div>
);

export const LogoutSuccessAlert = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 flex flex-col items-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12L10 18L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h2 className="text-xl font-semibold mb-6 text-center text-black">Logout Berhasil!</h2>
            <button
                onClick={onClose}
                className="bg-[#0F172A] text-white w-full py-2 rounded-md"
            >
                Oke
            </button>
        </div>
    </div>
);

export const Alert = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-gray-800 w-16 h-16 mb-2" />
            </div>
            <h2 className="text-xl font-semibold mb-6 text-center text-black">{message}</h2>
            <button
                onClick={onClose}
                className="bg-[#0F172A] text-white w-full py-2 rounded-md"
            >
                Oke
            </button>
        </div>
    </div>
);

export const Message = ({ message, status }) => (
    <div className={`${status ? 'text-green-500' : 'text-red-500'}`}>
        {message}
    </div>
);

export const Dialog = ({ isOpen, onClose, onConfirm }) => {
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 h-40">
                <h2 className="text-xl font-semibold mb-4 text-center text-black mt-4">Yakin untuk menghapus?</h2>
                <div className="flex justify-between mt-8">
                    <button onClick={onConfirm} className=" bg-red-600 text-white px-4 py-2 rounded-md w-[48%]">Ya</button>
                    <button onClick={onClose} className="bg-gray-800 text-white px-4 py-2 rounded-md w-[48%]">Tidak</button>
                </div>
            </div>
        </div>
    );
};
