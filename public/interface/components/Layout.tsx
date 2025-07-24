
import React, { ReactNode } from 'react';

const StanleyLogoFull = () => (
    <div className="bg-gray-300 p-4">
        <svg width="200" height="100" viewBox="0 0 240 120" className="text-gray-800 mx-auto" fill="currentColor">
            <text x="10" y="70" fontFamily="cursive, serif" fontSize="60" fontStyle="italic">Stanley</text>
            <text x="110" y="95" fontFamily="sans-serif" fontSize="16" fontWeight="bold">STUDIOS, LLC</text>
        </svg>
    </div>
);


const LoadingScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-sm text-center">
            <StanleyLogoFull />
            <h1 className="text-4xl font-light text-gray-700 my-6">Photography Schedule</h1>
            <div className="w-full bg-gray-200 border border-gray-400 rounded-sm overflow-hidden">
                <div className="bg-[#6c948f] text-sm font-medium text-white text-center p-1 leading-none" style={{ width: '70%' }}>
                    Loading...
                </div>
            </div>
            <p className="text-gray-500 mt-12 text-sm">(c) {new Date().getFullYear()} App Maker</p>
        </div>
    </div>
);


interface LayoutProps {
  children: ReactNode;
  loading: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, loading }) => {
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
