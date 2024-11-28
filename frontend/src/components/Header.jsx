import { Button, Navbar, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import axios from 'axios';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:4001/api/auth/checkAuth', { withCredentials: true });
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false); 
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post('http://localhost:4001/api/auth/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        Blogify
      </Link>
      <form>
        <TextInput
          type='text'
          placeholder='Search'
          rightIcon={AiOutlineSearch}
        />
      </form>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10' color='gray' pill>
          <FaMoon />
        </Button>
        {isAuthenticated ? (
          <Button gradientDuoTone='purpleToBlue' outline onClick={handleSignOut}>
            Sign Out
          </Button>
        ) : (
          <Link to='/signin'>
            <Button gradientDuoTone='purpleToBlue' outline>
            Sign In
            </Button>
          </Link>
        )}
      </div>
      <Navbar.Collapse>
        <Navbar.Link>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to='/about'>About</Link>
        </Navbar.Link>
       { isAuthenticated &&  (
        <Navbar.Link>
          <Link to='/dashboard'>Dashboard</Link>
        </Navbar.Link>
       )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;