import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BlogDetail = () => {
  const { id } = useParams(); // Retrieve blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4001/api/blog/${id}`);
        setBlog(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch the blog');
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!blog) {
    return <p>Blog not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[70%]">
      <h1 className="text-2xl font-bold text-pink-500">{blog.title}</h1>
      <p className="text-gray-600 mt-4">{blog.content}</p>
      <br></br>
      <p className="text-sm text-gray-500 mt-8">By {blog.author.username}</p>
    </div>
  );
};

export default BlogDetail;