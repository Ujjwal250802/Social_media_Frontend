import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

interface Image {
  url: string;
  uploadedAt: string;
}

interface User {
  _id: string;
  name: string;
  images: Image[];
}

const ImageGallery = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (userId: string, imagePath: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${userId}/images`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { imagePath }
        });
        
        setUsers(users.map(user => {
          if (user._id === userId) {
            return {
              ...user,
              images: user.images.filter(img => img.url !== imagePath)
            };
          }
          return user;
        }));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Image Gallery</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="p-4">
          {users.map((user) => (
            <div key={user._id} className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Images by {user.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {user.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"
                  >
                    <img
                      src={`http://localhost:5000${image.url}`}
                      alt={`Uploaded by ${user.name}`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteImage(user._id, image.url)}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;