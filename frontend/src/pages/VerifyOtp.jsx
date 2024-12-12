import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!id){
      alert('user id missing');
      return;
    }
    
    try {
      const res = await axios.post(`http://localhost:4001/api/auth/verify/${id}`, { otp }, {
        headers: {
          'Content-Type': 'application/json'
        }, withCredentials: true
      });
  
      alert(res.data.message);
  
      navigate('/');
      window.location.reload()
    } catch (error) {
      
      console.error("Error verifying OTP:", error.response?.data || error.message);
      alert(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className='pt-4 mt-4 mb-4 pb-4'>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-4 h-96 w-full max-w-xl my-16 mx-4 sm:my-32 sm:mx-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mt-4 mb-6">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full border-2 hover:bg-blue-400 text-black font-medium py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
    </div>
  );
  
};

export default VerifyOtp;
