import React from "react";

const About = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between space-x-8">

        <div className="w-1/2 text-center">
          <h1 className="text-blue-800 font-bold text-2xl md:text-2xl leading-tight">BLOGIFY</h1>
          <p className="text-gray-600 text-xl md:text-2xl">Thoughts that linger</p>
          <p className="text-gray-600 text-xl md:text-2xl">Stores that matter</p>
        </div>

        
        <div className="w-1/2 text-gray-800">
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-lg mb-4">
            Welcome to Blogify, a space where ideas come alive and stories find a voice. At Blogify, we believe that every thought,
            no matter how big or small, has the power to inspire, educate, and connect. Whether you're here to learn, explore, or
            simply unwind, we're here to share engaging stories and valuable insights with you.
          </p>
          <p className="text-lg">
            Join us as we dive deep into a range of topics — from technology and innovation to lifestyle and creativity. Thank you
            for being part of this journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
