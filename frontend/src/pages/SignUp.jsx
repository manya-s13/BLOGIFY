import { Label, TextInput, Button} from 'flowbite-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4001/api/auth/signup', {
        username,
        password,
        email
        });
        if(response.status === 200){
          alert('sign up successful');
          navigate('/signin');
        }
    } catch (error) {
      console.error(error.response ? error.response.data.message : error.message);
      alert('Signup failed: ' + (error.response ? error.response.data.message : error.message));
    }
  };
  

  return (
    <div className='pt-4 mt-4'>
    <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
      <div className='flex-1'>
        <Link to='/' className='font-bold dark:text-white text-4xl'>
          BLOGIFY
        </Link>
        <p className='text-sm mt-5'>
          This is a blogging website, write your blogs and read others blogs
        </p>
      </div>
      <div className='flex-1'>
      
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div>
            <Label value='username' />
            <TextInput 
            type='text'
             placeholder='username' 
             id='username'
             onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <Label value='Password' />
            <TextInput type='password'
             placeholder='password' 
             id='password' 
             onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <Label value='email' />
            <TextInput 
            type='email' 
            placeholder='email' 
            id='email' 
            onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button gradientDuoTone='purpleToPink' type='submit'>Sign Up</Button>
        </form>
        
        <div className='flex gap-2 text-sm mt-5'>
          <span>Have an Account?</span>
          <Link to='/signin' className='text-blue-500'>Sign In</Link>
          </div>
          </div>
      </div>
      </div>
  )
}

export default Signup