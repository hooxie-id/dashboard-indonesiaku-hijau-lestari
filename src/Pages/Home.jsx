import React from 'react';
import { getClassNames } from '../Components/Constant';

const Home = ({ isDarkMode }) => {
    const classNames = getClassNames(isDarkMode);
    return (
        <div className={`${classNames.bgColor} ${classNames.textColor} p-8 min-h-screen`}>
            <h1 className="text-4xl font-bold mb-4">Home</h1>
            <h2 className="text-xl mb-8">Selamat Datang!</h2>
        </div>
    );
};

export default Home;
