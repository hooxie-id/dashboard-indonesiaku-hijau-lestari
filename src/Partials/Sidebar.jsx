import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, UserCircle, LogOut } from 'lucide-react';
import { BsLayoutSidebarReverse } from 'react-icons/bs';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import { LogoutConfirmationAlert, LogoutSuccessAlert } from '../Components/Alert';

const Sidebar = ({ isDarkMode, setIsDarkMode, isOpen, setIsOpen }) => {
    const [userEmail, setUserEmail] = useState('admin@gmail.com');
    const [showLogout, setShowLogout] = useState(false);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAutoOpened, setIsAutoOpened] = useState(false);
    const location = useLocation();
    const profileRef = useRef(null);

    const menuItems = [
        { to: '/home', icon: <span role="img" aria-label="home">🏠</span>, text: 'Home' },
        { to: '/artikel', icon: <span role="img" aria-label="artikel">📰</span>, text: 'Artikel' },
        { to: '/member', icon: <span role="img" aria-label="member">👨‍💼</span>, text: 'Member' },
        { to: '/user', icon: <span role="img" aria-label="user">🙍🏻‍♂️</span>, text: 'User' },
        { to: '/profil', icon: <span role="img" aria-label="profil">👤</span>, text: 'Profil' },
    ];

    const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
    const hoverBgColor = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const activeBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
    const sidebarIconClose = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';

    const renderMenuItem = (to, icon, text = false) => {
        const isActive = to && isActiveRoute(to);
        const itemClassName = `flex items-center px-4 py-2 ${hoverBgColor} ${isActive ? activeBgColor : ''}`;

        const content = (
            <div className={`${itemClassName}`}>
                {icon && <span className="mr-2">{icon}</span>}
                <span className={`whitespace-nowrap font-bold text-lg}`}>{text}</span>
            </div>
        );

        return to ? (
            <Link to={to} key={to} className="block">
                {content}
            </Link>
        ) : content;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(profileRef.current && !profileRef.current.contains(event.target)) {
                setShowLogout(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUserEmail = async () => {
            setUserEmail('admin@gmail.com');
        };
        fetchUserEmail();
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setIsAutoOpened(false);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
    };

    const handleMouseMove = useCallback((e) => {
        if(window.innerWidth <= 768) return;

        const bufferZone = 20;
        if(e.clientX <= bufferZone && !isOpen) {
            setIsOpen(true);
            setIsAutoOpened(true);
        } else if(e.clientX > 256 && isAutoOpened) {
            setIsOpen(false);
            setIsAutoOpened(false);
        }
    }, [isOpen, isAutoOpened, setIsOpen]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);

    const handleLogout = () => {
        setShowLogoutAlert(true);
        setShowLogout(false);
    };

    const confirmLogout = () => {
        setShowLogoutAlert(false);
        setShowSuccessAlert(true);
    };

    const cancelLogout = () => {
        setShowLogoutAlert(false);
    };

    const handleSuccessClose = () => {
        setShowSuccessAlert(false);
        alert('User logged out');
        console.log("User logged out");
    };

    const isActiveRoute = (path) => location.pathname === path;

    const filteredMenuItems = menuItems.filter(item => {
        const isSearchMatch = item.text.toLowerCase().includes(searchQuery.toLowerCase());
        return isSearchMatch;
    });

    return (
        <>
            <button
                className={`fixed top-4 left-4 z-50 p-2 rounded-md ${sidebarIconClose} ${textColor} transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                onClick={toggleSidebar}
            >
                <BsLayoutSidebarReverse className="text-xl" />
            </button>

            <aside
                className={`fixed top-0 left-0 z-40 h-screen overflow-hidden transition-[width] duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-0'}`}
            >
                <div className={`h-full flex flex-col ${bgColor} ${textColor} border-r ${borderColor}`}>
                    <div className="p-4 flex-grow overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <div className="overflow-hidden w-36">
                                <img
                                    className="w-36"
                                    src={isDarkMode ? '/assets/images/logo-dishub.png' : '/assets/images/logo-black.png'}
                                    alt="DISHUB SITUBONDO"
                                />
                            </div>
                            <BsLayoutSidebarReverse
                                className="text-xl cursor-pointer"
                                onClick={toggleSidebar}
                            />
                        </div>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-md py-2 pl-8 pr-4`}
                            />
                            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <nav className="overflow-y-auto h-full">
                            <ul>
                                {filteredMenuItems.map((item) => renderMenuItem(item.to, item.icon, item.text))}
                            </ul>
                        </nav>
                    </div>
                    <div className="p-4 mt-auto flex items-center justify-between space-x-2">
                        <div className="relative flex-grow" ref={profileRef}>
                            <button
                                className={`w-full flex items-center justify-center p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-200 hover:bg-slate-100'}`}
                                onClick={() => setShowLogout(!showLogout)}
                            >
                                <UserCircle className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{userEmail}</span>
                            </button>
                            {showLogout && (
                                <button
                                    onClick={handleLogout}
                                    className={`absolute bottom-full left-0 right-0 mb-2 p-2 ${isDarkMode ? 'bg-[#582323]' : 'bg-red-800'} rounded-lg text-white flex items-center justify-center`}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            )}
                        </div>
                        <div className={`flex items-center rounded-full p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                            <button
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${!isDarkMode ? 'bg-white' : 'bg-transparent'}`}
                                onClick={toggleDarkMode}
                            >
                                <IoSunnyOutline className={`h-5 w-5 ${!isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                            </button>
                            <button
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-transparent'}`}
                                onClick={toggleDarkMode}
                            >
                                <IoMoonOutline className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-gray-400'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {showLogoutAlert && (
                <LogoutConfirmationAlert
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}

            {showSuccessAlert && (
                <LogoutSuccessAlert
                    onClose={handleSuccessClose}
                />
            )}
        </>
    );
};

export default Sidebar;