
import React from 'react';
import StanleyLogo from '../../assets/images/StanleyStudiosLLC-white-small.png';
console.log(StanleyLogo);

interface HeaderProps {
    title: string;
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="w-full p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-start">
             <div className="p-2 mr-4 flex-shrink-0">
                <img src={StanleyLogo} alt="Stanley Studios LLC Logo" className="h-16 md:h-20 w-auto" />    
            </div>
            <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl md:text-5xl font-light text-gray-800 dark:text-gray-200">{title}</h1>
                {subtitle && <h2 className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2">{subtitle}</h2>}
            </div>
        </div>
    </header>
  );
};

export default Header;
