
import React, { ReactNode } from 'react';
import StanleyLogo from '../../assets/images/StanleyStudiosLLC-white-small.png';
// console.log(StanleyLogo);

const LoadingScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-sm text-center">
            <div className="p-2 mr-4 flex-shrink-0">
                <img src={StanleyLogo} alt="Stanley Studios LLC Logo" className="h-16 md:h-20 w-auto" />    
            </div>
            <h1 className="text-4xl font-light app-title text-gray-700 dark:text-gray-300 my-6">Photography Schedule</h1>
            <div className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-sm loader-wrapper overflow-hidden">
                <div className="bg-[#6c948f] text-sm font-medium text-white text-center p-1 loader-bar leading-none" style={{ width: '70%' }}>
                    Loading...
                </div>
            </div>
            <p className="copyright text-gray-500 dark:text-gray-700 mt-12 text-sm">(c) {new Date().getFullYear()} Stanley Studios, LLC.</p>
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
    <div className="min-h-screen font-sans">
      <main className="container mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
