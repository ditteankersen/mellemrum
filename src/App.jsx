import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute"; 

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import EventPage from "./pages/EventPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage"; 

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="/om" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/tilmeldinger" element={<RegistrationsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </>
  );
}
