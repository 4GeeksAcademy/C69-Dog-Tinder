import React, { useContext } from "react"; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";  // From chchalle
import { Single } from "./pages/single";  // From chchalle
import ChatPage from "./pages/chatPage";  // From chchalle
import injectContext, { Context } from "./store/appContext";
import Navbar from "./component/navbar";
import { Footer } from "./component/footer";
import { LoginSignUp } from "./LoginSignUp";  // From main
import DogProfile from "./component/DogProfile"; 
import SettingsPage from './pages/SettingsPage'; 
import Playdates from './pages/Playdates'; 

// Main layout component
const Layout = () => {
    const basename = process.env.BASENAME || "";
    const { store } = useContext(Context);


// Retrieve userId from userProfile in store
const userId = store.userProfile ? store.userProfile.id : null;

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

                        {/* DogProfile Route - For viewing a single full profile */}
                        <Route path="/dog-profile/:id" element={<DogProfile />} />

                        {/* Settings Route - This is where you integrate the settings page */}
                        <Route path="/settings" element={<SettingsPage />} />

                         {/* Pass userId to Playdates page */}
                         {userId && (
                            <Route path="/playdates" element={<Playdates userId={userId} />} />
                        )}
                        
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
