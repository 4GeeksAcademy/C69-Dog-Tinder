import React, { useContext } from "react"; 
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";  // From chchalle
import { Single } from "./pages/single";  // From chchalle
import ChatPage from "./pages/chatPage";  // From chchalle
import injectContext, { Context } from "./store/appContext";
import Navbar from "./component/navbar";
import { Footer } from "./component/footer";
import { UserCreation } from './pages/UserCreation';
import DogProfileCreation from './pages/DogProfileCreation';
import { Login } from './pages/Login';
import DogProfile from "./component/DogProfile";
import DogSwipePage from "./pages/DogSwipePage";
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
                <Route
                    path="/chatPage/:id"
                    element={userId ? <ChatPage /> : <Navigate to="/login" />}
                />

                {/* Login/Signup route */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<UserCreation />} />
                <Route path="/dog-profile-creation" element={<DogProfileCreation />} />

                {/* DogProfile Route - For viewing a single full profile */}
                <Route
                    path="/dog-profile/:id"
                    element={userId ? <DogProfile /> : <Navigate to="/login" />}
                />

                {/* Dog swipe route */}
                <Route
                    path="/swipe"
                    element={userId ? <DogSwipePage /> : <Navigate to="/login" />}
                />

                {/* Settings Route */}
                <Route
                    path="/settings"
                    element={userId ? <SettingsPage /> : <Navigate to="/login" />}
                />

                {/* Playdates Route */}
                <Route
                    path="/playdates"
                    element={userId ? <Playdates userId={userId} /> : <Navigate to="/login" />}
                />

                {/* 404 Route */}
                <Route path="*" element={<h1>Not found!</h1>} />
            </Routes>

            {/* Footer */}
            <Footer />
        </BrowserRouter>
    </div>
);
};

export default injectContext(Layout);