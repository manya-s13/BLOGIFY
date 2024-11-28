import axios from "axios";
import { useNavigate } from "react-router-dom";  // for redirection
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const navigate = useNavigate(); 

  useEffect(() => {
      axios.get("http://localhost:4001/api/blog/myBlogs", { withCredentials: true })
        .then((response) => {
          setPosts(response.data.data); 
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
  }, []); 

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPost.title || !newPost.content) {
      alert("Title and content cannot be empty!");
      return;
    }
    axios.post("http://localhost:4001/api/blog/create",
        newPost,
        { withCredentials: true }
      )
      .then((response) => {
        setPosts([...posts, response.data.blog]);
        setNewPost({ title: "test", content: "test" });
        toggleModal();
      })
      .catch((error) => {
        console.error("Error creating a post:", error);
        alert("Failed to publish the post. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-800 font-medium">
              Posts
            </a>
            
          </nav>
          <button
            onClick={toggleModal}
            className="bg-pink-500 text-white px-4 py-2 rounded-md shadow hover:bg-pink-600"
          >
            New Post
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Posts</h1>
        <div className="mt-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id} 
                className="bg-white shadow rounded-md p-4 my-2"
              >
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-gray-600">{post.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-md w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-6">Create New Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPost.title}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 mt-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter the post title"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block text-gray-700 font-medium"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={newPost.content}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 mt-2 focus:ring-pink-500 focus:border-pink-500"
                  rows="10"
                  placeholder="Write your content here..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-6 py-2 rounded-md shadow hover:bg-pink-600"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
