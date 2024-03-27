import React from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import SearchDetails from "./components/SearchDetails";
import Watchlist from "./components/Watchlist";
import Portfolio from "./components/Portfolio";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main role="main" className="flex-shrink-0">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate replace to="/search/home" />} />
            <Route path="/search/home" element={<HomePage />} />
            <Route path="/search/:ticker" element={<SearchDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;