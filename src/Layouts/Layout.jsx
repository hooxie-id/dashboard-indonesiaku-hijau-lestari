import React, { useState, useEffect } from 'react';
import Sidebar from '../Partials/Sidebar';
import { getClassNames } from '../Components/Constant';

const Layout = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const classNames = getClassNames(isDarkMode);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`flex min-h-screen ${classNames.bgColor} ${classNames.textColor}`}>
            <Sidebar
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-72' : 'md:ml-16 ml-6'}`}>
                {React.Children.map(children, child =>
                    React.cloneElement(child, { isDarkMode })
                )}
            </div>
        </div>
    );
};

export default Layout;