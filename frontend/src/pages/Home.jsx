import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const turncateContent = (content) =>{
    return content.split(' ').splice(0, 10).join(' ') + '...';
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get('http://localhost:4001/api/blog/blogs');
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-100 h-full relative">
      <header className="bg-white shadow-md py-4">
        <h1 className="text-center text-2xl font-bold text-blue-700">BLOGIFY</h1>
      </header>
      
      <main className="container mx-auto px-4 py-4 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <h3 className='semibold text-md'>Latest Articles</h3>  


        
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-#78716c rounded-lg shadow-md pt-2 overflow-hidden">
            
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{blog.title}</h2>
              <p className="text-sm text-gray-600 mt-2">{turncateContent(blog.content)}</p>
           
              <Link
                to={`/${blog._id}`}
                className="text-blue-500 mt-4 hover:underline"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default App;