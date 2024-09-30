import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar"; // If you plan to use Navbar, include it here
import { Footer } from "./component/footer";
import { LoginSignUp } from "./LoginSignUp";

// Create your first component
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
                    {/* Uncomment if Navbar is to be included */}
                    {/* <Navbar /> */}
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<LoginSignUp />} path="/login" /> {/* Changed to a unique path */}
                        <Route element={<h1>Not found!</h1>} path="*" /> {/* Catch-all for 404 */}
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
