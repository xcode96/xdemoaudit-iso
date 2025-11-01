
import React from 'react';

const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LogInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

const LogOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);


interface HeaderProps {
    isAdmin: boolean;
    onLoginClick: () => void;
    onLogout: () => void;
    onNavigateToLearningHub: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLoginClick, onLogout, onNavigateToLearningHub }) => {
  return (
    <header className="bg-[#2d3748]/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShieldIcon className="h-7 w-7 text-gray-200" />
            <span className="text-xl font-bold text-gray-100">ISO Audit Tool</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onNavigateToLearningHub} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <BookOpenIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Learning Hub</span>
            </button>
            <a href="https://github.com/xcode96" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <GithubIcon className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
             {isAdmin ? (
                <button onClick={onLogout} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-md">
                    <LogOutIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
             ) : (
                <button onClick={onLoginClick} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-md">
                    <LogInIcon className="h-5 w-5" />
                    <span>Admin Login</span>
                </button>
             )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
