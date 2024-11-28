import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp  from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Foot  from './components/Foot';
import BlogDetail from './pages/BlogDetail'

function App() {
  return (
   <BrowserRouter>
   <Header />
   <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/about' element={<About />} />
    <Route path='/signin' element={<SignIn />} />
    <Route path='/signup' element={<SignUp />} />
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/:id' element={<BlogDetail />} />
   </Routes>
   <Foot />
   </BrowserRouter>
  );
}

export default App;
