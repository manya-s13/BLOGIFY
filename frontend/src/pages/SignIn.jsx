import { Label, TextInput, Button} from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4001/api/auth/signin', {
      email,  
      password}, { withCredentials: true });
        if (response.status === 200) {
          const  userId  = response.data.user._id;
          // alert('Login successful!');
          navigate(`/verify/${userId}`);
        } else{
          alert('Signin failed: Unexpected status code');
        }
    } catch (error) {
      console.error(error.response ? error.response.data.message : error.message);
      alert('Signin failed: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className='pt-4 mt-4 mb-4 pb-4'>
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
            <Label value='email' />
            <TextInput 
            type='text'
             placeholder='email@gmail.com' 
             id='email'
             onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label value='Password' />
            <TextInput type='password'
             placeholder='password' 
             id='password' 
             onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button gradientDuoTone='purpleToPink' type='submit'>Sign In</Button>
        </form>
        
        <div className='flex gap-2 text-sm mt-5'>
          <span> Don't Have an Account?</span>
          <Link to='/signup' className='text-blue-500'>Sign Up</Link>
          </div>
        
          </div>
      </div>
      </div>
  )
}

export default SignIn