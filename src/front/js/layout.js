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
import DogProfile from "./component/DogProfile";
import { Footer } from "./component/footer";
import { LoginSignUp } from "./LoginSignUp";  // From main

// Example dog profile object
const exampleProfile = {
    username: "Buddy",
    photos: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzdKy18Gk8V7Fg66o6IUUZO-uEHzOg55QAxXeQ420JSnReEStlZU1ihqbEdKzWu_EBJPU&usqp=CAU",
    bio: "Friendly and energetic dog looking for playdates!",
    age: 3,
    breed: "Golden Retriever",
    city: "Atlanta",
    state: "GA",
    temperment: "Friendly",
    looking_for: "Playdates",
    user_id: 2,  // dog ID
};

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

                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />  {/* Keep from chchalle */}
                        <Route element={<Single />} path="/single/:theid" />  {/* Keep from chchalle */}
                        <Route element={<ChatPage />} path="/chatPage/:id" />  {/* Keep from chchalle */}
                        <Route element={<LoginSignUp />} path="/login" />  {/* Keep from main */}
                        <Route
                            element={<DogProfile profile={exampleProfile} currentUserId={1} />}
                            path="/dog-profile/:id"
                        />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>

                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
