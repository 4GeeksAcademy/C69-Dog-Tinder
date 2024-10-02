import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import Navbar from "./component/navbar";
import DogProfile from "./component/DogProfile"; 
import { Footer } from "./component/footer";

// Example
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

// Definir Layout
const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        
                        <Route
                            element={<DogProfile profile={exampleProfile} currentUserId={1} />}
                            path="/dog-profile/:id"
                        />

                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
