import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';

function Foot() {
  return (
    <Footer container className="border-t-8  border-teal-500 bg-gray-50 dark:bg-gray-800 mt-2 pt-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-3 gap-8">
          <div className="mb-4 sm:mb-0">
            <Link 
              to='/' 
              className="self-center whitespace-nowrap text-2xl font-bold text-teal-700 dark:text-white flex items-center"
            >
              BLOGIFY
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-xs">
              Your go-to platform for insightful stories, creative writing, and thought-provoking content.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Quick Links" />
              <Footer.LinkGroup col>
                <Link to="/about" className="hover:text-teal-600">About</Link>
                <Link to="/blog" className="hover:text-teal-600">Blog</Link>
              </Footer.LinkGroup>
            </div>
            <div>
              
              <Footer.LinkGroup col>
                <Link to="/privacy" className="hover:text-teal-600">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-teal-600">Terms of Service</Link>
              </Footer.LinkGroup>
            </div>
          </div>

          <div>
            <Footer.Title title="Connect With Us" />
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 hover:text-teal-600">
                <MdEmail />
                <a href="mailto:contact@blogify.com">contact@blogify.com</a>
              </div>
              <div className="flex space-x-4 mt-2">
                <Footer.Icon href="https://facebook.com" icon={BsFacebook} className="text-blue-600 hover:text-blue-800" />
                <Footer.Icon href="https://instagram.com" icon={BsInstagram} className="text-pink-600 hover:text-pink-800" />
                <Footer.Icon href="https://twitter.com" icon={BsTwitter} className="text-blue-400 hover:text-blue-600" />
                <Footer.Icon href="https://github.com" icon={BsGithub} className="text-gray-800 dark:text-white hover:text-gray-600" />
                <Footer.Icon href="https://linkedin.com" icon={BsLinkedin} className="text-blue-700 hover:text-blue-900" />
              </div>
            </div>
          </div>
        </div>

        <Footer.Divider />

        <div className="w-full flex flex-col sm:flex-row items-center justify-between">
          <Footer.Copyright href="#" by="Manya's Blogify" year={new Date().getFullYear()} />
          
        </div>
      </div>
    </Footer>
  );
}

export default Foot;