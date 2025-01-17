import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Palette } from 'lucide-react';
import axios from 'axios';

const UserForm = () => {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formColor, setFormColor] = useState('from-blue-400 to-blue-600');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const colors = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-green-400 to-green-600'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImages(files);
    if (files) {
      setFileNames(Array.from(files).map((file) => file.name));
    } else {
      setFileNames([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('platform', platform);
      formData.append('handle', handle);

      if (images) {
        Array.from(images).forEach((image) => {
          formData.append('images', image);
        });
      }

      await axios.post('http://localhost:5000/api/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
      });

      setPlatform('');
      setHandle('');
      setImages(null);
      setFileNames([]);
      alert('Upload successful!');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error uploading. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 relative">
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className={`absolute inset-0 bg-gradient-to-r ${formColor} shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl`}></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Upload Images & Social Media</h1>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="py-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Social Media Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Platform</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Social Media Handle
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@username"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Images
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload files</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>
                  {fileNames.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600">
                      {fileNames.map((fileName, index) => (
                        <li key={index} className="truncate">
                          {fileName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r ${formColor} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                >
                  {isSubmitting ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;