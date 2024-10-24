import React from 'react';

const MenuItem = ({ icon, text, active = false, isDarkMode }) => (
    <li className={`mb-2 ${active ? (isDarkMode ? 'bg-blue-600' : 'bg-blue-100') : ''}`}>
        <a href="/" className={`flex items-center py-2 px-4 ${active ? (isDarkMode ? 'text-white' : 'text-blue-600') : (isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900')}`}>
        {icon}
        <span className="ml-3">{text}</span>
        </a>
    </li>
);

export default MenuItem;