/* global chrome */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, X, Settings, LogOut, User, Power } from 'lucide-react';

const styles = {
  container: {
    background: 'linear-gradient(to bottom, #000044, #000022)',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  appBar: {
    height: '64px',
    width: '100%',
    background: '#000055FF',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(255, 122, 0, 0.2)'
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#FF7A00',
    borderRadius: '8px',
    '&:hover': {
      background: 'rgba(255, 122, 0, 0.1)'
    }
  },
  profileSection: {
    position: 'relative'
  },
  profileButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    padding: '8px',
    border: '2px solid #FF7A00',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 122, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FF7A00',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(255, 122, 0, 0.3)',
      background: 'rgba(255, 122, 0, 0.2)'
    }
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    background: '#000055FF',
    borderRadius: '8px',
    width: '200px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-10px)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 122, 0, 0.2)'
  },
  dropdownMenuVisible: {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    gap: '12px',
    '&:hover': {
      background: 'rgba(255, 122, 0, 0.1)'
    }
  },
  dropdownIcon: {
    color: '#FF7A00',
    width: '20px',
    height: '20px'
  },
  dropdownDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '4px 0'
  },
  menuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
    zIndex: 150
  },
  menuOverlayVisible: {
    opacity: 1,
    visibility: 'visible'
  },
  sideMenu: {
    position: 'fixed',
    top: 0,
    left: '-75%',
    width: '75%',
    height: '100%',
    background: '#0000559A',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease',
    zIndex: 200,
    padding: '80px 20px 20px',
    boxSizing: 'border-box'
  },
  sideMenuOpen: {
    transform: 'translateX(100%)'
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#FF7A00',
    borderRadius: '8px',
    '&:hover': {
      background: 'rgba(255, 122, 0, 0.1)'
    }
  },
  content: {
    paddingTop: '64px',
    height: 'calc(100vh - 64px)',
    position: 'relative'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    color: '#FF7A00',
    borderRadius: '8px',
    marginRight: '12px',
    '&:hover': {
      background: 'rgba(255, 122, 0, 0.1)'
    }
  },
  toggleButtonActive: {
    color: '#4CAF50',
    '&:hover': {
      background: 'rgba(76, 175, 80, 0.1)'
    }
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrapingEnabled, setIsScrapingEnabled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial scraping state from chrome storage
    console.log('Loading initial scraping state...');
    try {
      if (!chrome || !chrome.storage || !chrome.storage.local) {
        console.error('Chrome storage API not available during initialization');
        return;
      }

      chrome.storage.local.get(['isScrapingEnabled'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error loading initial scraping state:', chrome.runtime.lastError);
          return;
        }
        const initialState = result.isScrapingEnabled || false;
        console.log('Loaded initial scraping state:', initialState);
        setIsScrapingEnabled(initialState);
      });
    } catch (error) {
      console.error('Error in initialization:', error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/SignIn');
  };

  const handleSettings = () => {
    // Handle settings navigation here
    console.log('Navigate to settings');
  };

  const toggleScraping = () => {
    const newState = !isScrapingEnabled;
    setIsScrapingEnabled(newState);
    console.log('Attempting to toggle scraping to:', newState);
    
    try {
      if (!chrome || !chrome.storage || !chrome.storage.local) {
        console.error('Chrome storage API not available');
        return;
      }

      // Save to chrome storage
      chrome.storage.local.set({ isScrapingEnabled: newState }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving scraping state:', chrome.runtime.lastError);
          return;
        }
        console.log('Scraping state saved:', newState);
      });

      // Broadcast the change to other parts of the extension
      chrome.runtime.sendMessage({
        type: 'TOGGLE_SCRAPING',
        enabled: newState
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error broadcasting scraping state:', chrome.runtime.lastError);
          return;
        }
        console.log('Successfully broadcast scraping state:', newState);
      });
    } catch (error) {
      console.error('Error in toggleScraping:', error);
    }
  };

  return (
    <div style={styles.container}>
      {/* App Bar */}
      <div style={styles.appBar}>
        <button 
          style={styles.menuButton}
          onClick={toggleMenu}
        >
          <MenuIcon size={24} strokeWidth={2} />
        </button>

        {/* Right Section with Toggle and Profile */}
        <div style={styles.rightSection}>
          <button
            style={{
              ...styles.toggleButton,
              ...(isScrapingEnabled && styles.toggleButtonActive)
            }}
            onClick={toggleScraping}
            title={isScrapingEnabled ? 'Disable Scraping' : 'Enable Scraping'}
          >
            <Power size={24} strokeWidth={2} />
          </button>

          {/* Profile Section */}
          <div style={styles.profileSection} ref={profileRef}>
            <button 
              style={styles.profileButton}
              onClick={toggleProfileMenu}
            >
              <User size={20} strokeWidth={2} />
            </button>

            {/* Profile Dropdown Menu */}
            <div 
              style={{
                ...styles.dropdownMenu,
                ...(isProfileMenuOpen && styles.dropdownMenuVisible)
              }}
            >
              <div 
                style={styles.dropdownItem}
                onClick={handleSettings}
              >
                <Settings style={styles.dropdownIcon} size={20} />
                Settings
              </div>
              <div style={styles.dropdownDivider} />
              <div 
                style={styles.dropdownItem}
                onClick={handleLogout}
              >
                <LogOut style={styles.dropdownIcon} size={20} />
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      <div 
        style={{
          ...styles.menuOverlay,
          ...(isMenuOpen && styles.menuOverlayVisible)
        }}
        onClick={toggleMenu}
      />

      {/* Side Menu */}
      <div 
        style={{
          ...styles.sideMenu,
          ...(isMenuOpen && styles.sideMenuOpen)
        }}
      >
        <button 
          style={styles.closeButton}
          onClick={toggleMenu}
        >
          <X size={24} strokeWidth={2} />
        </button>
        {/* Menu content will go here */}
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Dashboard content will go here */}
      </div>
    </div>
  );
};

export default Dashboard; 