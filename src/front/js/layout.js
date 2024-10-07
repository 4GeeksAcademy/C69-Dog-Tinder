import React from "react"; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";  // From chchalle
import { Single } from "./pages/single";  // From chchalle
import ChatPage from "./pages/chatPage";  // From chchalle
import injectContext from "./store/appContext";
import Navbar from "./component/navbar";
import DogList from './component/DogList';
import { Footer } from "./component/footer";
import { LoginSignUp } from "./LoginSignUp";  // From main
import DogProfile from "./component/DogProfile"; // Assuming you have a full profile view for a dog

// Main layout component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    // Check for backend URL
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    {/* Navbar component */}
                    <Navbar />

                    {/* Define routes */}
                    <Routes>
                        {/* Home route */}
                        <Route path="/" element={<Home />} />

                        {/* Demo and other static pages */}
                        <Route path="/demo" element={<Demo />} />
                        <Route path="/single/:theid" element={<Single />} />

                        {/* Chat route */}
                        <Route path="/chatPage/:id" element={<ChatPage />} />

                        {/* Login/Signup route */}
                        <Route path="/login" element={<LoginSignUp />} />

                        {/* Profiles Route - DogList renders the swipeable profiles */}
                        <Route path="/profiles" element={<DogList userId={1} />} />

                        {/* DogProfile Route - For viewing a single full profile */}
                        <Route path="/dog-profile/:id" element={<DogProfile />} />

                        {/* 404 Not Found Route */}
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>

                    {/* Footer */}
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
