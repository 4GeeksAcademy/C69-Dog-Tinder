import React, { useContext } from "react"; 
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";  
import { Single } from "./pages/single";  
import ChatPage from "./pages/chatPage";  
import injectContext, { Context } from "./store/appContext";
import Navbar from "./component/navbar";
import { Footer } from "./component/footer";
import { SignUp } from './pages/SignUp';
import DogProfileCreation from './pages/DogProfileCreation';
import { Login } from './pages/Login';
import DogProfile from "./component/DogProfile";
import DogSwipePage from "./pages/DogSwipePage";
import SettingsPage from './pages/SettingsPage'; 
import Playdates from './pages/Playdates'; 
import UserProfile from './pages/UserProfile';

const Layout = () => {
    const basename = process.env.BASENAME || "";
    const { store } = useContext(Context);

    // Obtener userId y dogProfile de store
    const userId = store.userProfile ? store.userProfile.id : null;
    const dogProfile = store.dogProfile || null; // Asigna datos reales o null si no están disponibles

    // Define funciones manejadoras
    const handleLike = (dogId) => {
        console.log(`Liked dog with ID: ${dogId}`);
    };

    const handleDiscard = (dogId) => {
        console.log(`Discarded dog with ID: ${dogId}`);
    };

    const handleViewProfile = (dogId) => {
        console.log(`Viewing profile of dog with ID: ${dogId}`);
    };

    // Verifica si el BACKEND_URL está configurado
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }

    return (
        <div>
            <BrowserRouter basename={basename}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/demo" element={<Demo />} />
                    <Route path="/single/:theid" element={<Single />} />
                    <Route path="/chat/:partnerUserId" element={ <ChatPage /> } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dog-profile-creation" element={<DogProfileCreation />} />
                    
                    {/* Usa datos dinámicos para DogProfile */}

                    <Route 
    path="/dog-profile/:id" 
    element={
        userId && dogProfile?.id
            ? <DogProfile dog={dogProfile} onLike={handleLike} onDiscard={handleDiscard} onViewProfile={handleViewProfile} /> 
            : <Navigate to="/login" />
    } 
/>
                    
                    <Route path="/swipe" element={userId ? <DogSwipePage /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={userId ? <SettingsPage /> : <Navigate to="/login" />} />
                    <Route path="/playdates/:id" element={userId ? <Playdates userId={userId} /> : <Navigate to="/login" />} />
                    <Route path="/my-profile" element={userId ? <UserProfile /> : <Navigate to="/login" />} />
                    <Route path="*" element={<h1>Not found!</h1>} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
