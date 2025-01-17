import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

interface SocialHandle {
  platform: string;
  handle: string;
  addedAt: string;
}

interface User {
  _id: string;
  name: string;
  socialHandles: SocialHandle[];
}

const SocialHandles = () => {
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

  const handleDelete = async (userId: string, platform: string) => {
    if (window.confirm('Are you sure you want to delete this social handle?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${userId}/social-handles`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { platform }
        });
        
        setUsers(users.map(user => {
          if (user._id === userId) {
            return {
              ...user,
              socialHandles: user.socialHandles.filter(handle => handle.platform !== platform)
            };
          }
          return user;
        }));
      } catch (error) {
        console.error('Error deleting social handle:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Social Media Handles
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user._id} className="px-4 py-4 sm:px-6">
              <div className="mb-2">
                <h4 className="text-lg font-medium text-gray-900">{user.name}'s Social Handles</h4>
              </div>
              {user.socialHandles && user.socialHandles.length > 0 ? (
                user.socialHandles.map((handle, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <h5 className="text-md font-medium text-gray-900">
                        {handle.platform}
                      </h5>
                      <p className="text-sm text-gray-500">{handle.handle}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(user._id, handle.platform)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No social handles added yet.</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocialHandles;