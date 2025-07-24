
import React from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

const StanleyLogo = () => (
    <svg width="150" height="75" viewBox="0 0 200 100" className="text-gray-700" fill="currentColor">
        <text x="10" y="60" fontFamily="cursive, serif" fontSize="40" fontStyle="italic">
            Stanley
        </text>
        <text x="90" y="80" fontFamily="sans-serif" fontSize="12" fontWeight="bold">
            STUDIOS, LLC
        </text>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="w-full p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-start">
             <div className="bg-gray-300 p-2 mr-4 flex-shrink-0">
                <svg width="120" height="60" viewBox="0 0 160 80" className="text-gray-800" fill="currentColor">
                    <text x="5" y="50" fontFamily="cursive, serif" fontSize="40" fontStyle="italic">Stanley</text>
                </svg>
            </div>
            <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl md:text-5xl font-light text-gray-800">{title}</h1>
                {subtitle && <h2 className="text-lg md:text-xl text-gray-600 mt-2">{subtitle}</h2>}
            </div>
        </div>
    </header>
  );
};

export default Header;
