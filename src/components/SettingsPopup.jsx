import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const SettingsPopup = ({ onClose, onNameUpdate}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

     // This hook will run when the component mounts
     useEffect(() => {
        // Get the token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        try {
            // Decode the token
            const decoded = jwtDecode(token);
            console.log(decoded); // Check the decoded object in the console
            
            // Check if the decoded token contains 'name' and 'email'
            if (decoded.name && decoded.email) {
                setName(decoded.name);
                setEmail(decoded.email);
            } else {
                console.error('Token does not contain name and/or email');
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    }, []); // Empty dependency array to only run on mount
    


    
    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent form submission default behavior
    
        // Trim the password to handle spaces-only input
        const trimmedPassword = newPassword.trim();
        
        // Check if the new password is not empty and less than 8 characters
        if (trimmedPassword !== '' && trimmedPassword.length < 8) {
            alert("Password must be at least 8 characters long!");
            return; // Stop further execution if password is too short
        }
    
        const token = localStorage.getItem("token"); // Get the token from localStorage
    
        if (!token) {
            console.error("Token not found");
            return;
        }
    
        setLoading(true); // Set loading to true when the request starts
    
        try {
            // Prepare the data to update - only include name by default
            const updateData = {
                name: name.trim(),  // Updated name (trimmed)
                updatePassword: false // Explicitly tell backend not to update password by default
            };
    
            // Only include the password if it's not empty (after trimming)
            if (trimmedPassword !== "") {
                updateData.password = trimmedPassword;
                updateData.updatePassword = true; // Explicitly tell backend to update password
            }
    
            console.log('Sending update data:', updateData);
    
            const response = await axios.put('http://localhost:3000/api/users/updateUser', updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send the token as part of the Authorization header
                },
            });
    
            console.log('User updated:', response.data);
            onNameUpdate(name);
            setName(name);
            alert('Profile updated successfully!');
            setLoading(false); // Stop loading once the request is complete
            onClose(); // Close the popup after successful update
    
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
            alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
            setLoading(false); // Stop loading on error
        }
    };
    
    return (
        <div className="fixed inset-0 flex justify-center items-center text-start backdrop-blur-sm bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[600px]">
                <div className='flex justify-between items-center mb-5'>
                    <h2 className="text-xl font-semibold text-black">Account Settings</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            className="border p-2 rounded w-full bg-gray-200 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Enter new password (Leave blank to keep current)"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPopup;