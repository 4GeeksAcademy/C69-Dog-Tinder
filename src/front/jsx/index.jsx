//import react into the bundle
import React from "react";
import ReactDOM from "react-dom/client";

// include your styles into the webpack bundle
import "../styles/styles.css";

//import your own components
import app from "./src/app.jsx";

//render your react application
ReactDOM.createRoot(document.getElementById('app')).render(<app/>);