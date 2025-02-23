import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './useAuth';
import Navigation from './Navigation';
import Home from './Home';
import Auth from './Auth';
import Editor from './Editor';
import Dashboard from './Dashboard';
import Pricing from './Pricing';
import Contact from './Contact';
import Features from './Features';
import { useDarkMode } from './hooks/useDarkMode';

const App: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'editor' | 'dashboard' | 'pricing' | 'contact' | 'features'>('home');  const { user, signIn, signOut } = useAuth();
	const { isDarkMode, setIsDarkMode } = useDarkMode();


	const renderPage = () => {
		switch (currentPage) {
		  case 'home':
			return  <Home setCurrentPage={setCurrentPage} />;
		  case 'auth':
			return <Auth onSignIn={signIn} />;
		  case 'editor':
			return <Editor />;
		  case 'dashboard':
			return user ? <Dashboard /> : <Auth onSignIn={signIn} />;
		  case 'pricing':
			return <Pricing />;
		  case 'contact':
			return <Contact />;
		  case 'features':
			return <Features />;
		  default:
			return <Home setCurrentPage={setCurrentPage} />;
		}
	  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onSignOut={signOut}
		isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-8"
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default App;