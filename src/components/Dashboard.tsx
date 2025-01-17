import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Users, Image, Hash, LogOut, ChevronRight, ChevronLeft, Home, Palette } from 'lucide-react';
import UsersList from './dashboard/UsersList';
import SocialHandles from './dashboard/SocialHandles';
import ImageGallery from './dashboard/ImageGallery';
import HomePage from './dashboard/Home';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarColor, setSidebarColor] = useState('bg-gray-900');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const colors = {
    dark: 'bg-gray-900',
    blue: 'bg-blue-800',
    purple: 'bg-purple-800',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleColorPicker = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Color Picker */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={toggleColorPicker}
            className={`w-10 h-10 rounded-full ${sidebarColor} hover:ring-2 hover:ring-white transition-all duration-200 flex items-center justify-center`}
          >
            <Palette className="w-6 h-6 text-white" />
          </button>
          
          {isColorPickerOpen && (
            <div className="absolute right-0 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-200">
              <div className="flex flex-col gap-2 p-2">
                {Object.entries(colors).map(([name, color]) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSidebarColor(color);
                      setIsColorPickerOpen(false);
                    }}
                    className={`w-8 h-8 rounded-full ${color} hover:ring-2 hover:ring-white transition-all duration-200`}
                    title={`Switch to ${name} theme`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } ${sidebarColor} text-white flex-shrink-0 fixed h-full transition-all duration-300 z-40`}
      >
        <div className="p-4 flex flex-col items-center">
          <div className="mt-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold">
              A
            </div>
          </div>
        </div>
        <nav className="mt-8">
          <Link
            to="/admin/dashboard/home"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-opacity-20 hover:bg-white hover:text-white ${
              activeTab === 'home' ? 'bg-white bg-opacity-20 text-white' : ''
            }`}
            onClick={() => setActiveTab('home')}
          >
            <Home className="h-5 w-5 mr-3" />
            {isSidebarOpen && 'Home'}
          </Link>
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-opacity-20 hover:bg-white hover:text-white ${
              activeTab === 'users' ? 'bg-white bg-opacity-20 text-white' : ''
            }`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-5 w-5 mr-3" />
            {isSidebarOpen && 'Users'}
          </Link>
          <Link
            to="/admin/dashboard/social-handles"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-opacity-20 hover:bg-white hover:text-white ${
              activeTab === 'social' ? 'bg-white bg-opacity-20 text-white' : ''
            }`}
            onClick={() => setActiveTab('social')}
          >
            <Hash className="h-5 w-5 mr-3" />
            {isSidebarOpen && 'Social Handles'}
          </Link>
          <Link
            to="/admin/dashboard/images"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-opacity-20 hover:bg-white hover:text-white ${
              activeTab === 'images' ? 'bg-white bg-opacity-20 text-white' : ''
            }`}
            onClick={() => setActiveTab('images')}
          >
            <Image className="h-5 w-5 mr-3" />
            {isSidebarOpen && 'Images'}
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-opacity-20 hover:bg-white hover:text-white w-full"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {isSidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 ${
          isSidebarOpen ? 'left-60' : 'left-4'
        } z-50 p-2 rounded-md ${sidebarColor} text-white hover:bg-opacity-90 transition-all duration-300`}
      >
        {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </button>

      {/* Main content */}
      <div 
        className={`flex-1 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        } transition-all duration-300`}
      >
        <div className="p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/" element={<UsersList />} />
              <Route path="/social-handles" element={<SocialHandles />} />
              <Route path="/images" element={<ImageGallery />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;