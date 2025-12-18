import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from
 "./context/AuthContext";
import "./index.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <Toaster position="top-right" />
    <BrowserRouter>
      <ErrorBoundary>
          <AuthProvider>
             <App />
          </AuthProvider>
        </ErrorBoundary>
    </BrowserRouter>
    
  </React.StrictMode>
);
