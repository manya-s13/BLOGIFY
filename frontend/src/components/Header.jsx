import { Button, Navbar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import axios from "axios";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/auth/checkAuth",
        { withCredentials: true }
      );
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
    }
  };

  const checkSubscribedStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/auth/isSubscribed",
        { withCredentials: true }
      );
      setIsSubscribed(response.data.isSubscribed);
    } catch (error) {
      console.log("Error getting subscribed status");
    }
  };

  useEffect(() => {
    checkAuthStatus();
    checkSubscribedStatus();
  }, []);

  console.log(isSubscribed + "User is Subscribed");

  const handleSignOut = async () => {
    try {
      await axios.post(
        "http://localhost:4001/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getPremium = async () => {
    try{ const stripe = await loadStripe(
      "pk_test_51QU1zuSF1Q7uGZD2wNwI65YV7gA10ENG2wGGzKGxm2oZh8Zt9bMovtaErR4I6CUJMVV7bzvv7LpP1PKCOLy787vH002KybexJF"
    );

    const response = await axios.post(
      `http://localhost:4001/api/payments/create-checkout-session`,
      {},
      { withCredentials: true }
    );

    const session = response.data;
    console.log("Session Data:", session);

   
    const result = await stripe.redirectToCheckout({
      sessionId: session.id, 
    });

    if (result.error) {
      console.log("Error redirecting to checkout:", result.error);
    }}catch(error){console.error(error)}
   
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-lg sm:text-xl  dark:text-white font-bold mt-2"
      >
        BLOGIFY
      </Link>

      <div className="flex gap-2 md:order-2"></div>
      <Navbar.Collapse className="flex items-center justify-center pt-2">
        <Navbar.Link className="mt-2">
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link className="mt-2">
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link className="mt-2">
          <Link to="/Admin">Admin</Link>
        </Navbar.Link>
        {isAuthenticated && (
          <Navbar.Link className="mt-2">
            <Link to="/dashboard">Dashboard</Link>
          </Navbar.Link>
        )}

        {isAuthenticated ? (
          <div className="flex  flex-row gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              outline
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Link to="/signin">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        {isAuthenticated ? (isSubscribed ? (
          <Button
          size="sm"
          color={"dark"}
          className="bg-black"
          gradientDuoTone="purpleToBlue"
          outline
         
        >
          Subscribed
        </Button>
        ) : (
          <div>
            <Button
              size="sm"
              color={"dark"}
              className="bg-black"
              gradientDuoTone="purpleToBlue"
              outline
              onClick={getPremium}
            >
              Get Premium
            </Button>
          </div>
        )) : <></>}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
