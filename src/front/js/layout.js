import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import AppNavbar from "./component/AppNavbar";
import Login from './pages/login';

import { Home } from "./pages/home";
import injectContext from "./store/appContext";


import { Footer } from "./component/footer";


const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL === "") {
        return <BackendURL />;
    }
    

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <AppNavbar />  {/* Ensure the Navbar is rendered */}
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);