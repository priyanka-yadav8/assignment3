import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useStockData } from "../contexts/StockDataContext";


const Navbar = () => {
    const getNavLinkClass = ({ isActive }) => {
        // console.log(isActive, "isactive")
        return isActive ? "nav-link border border-light rounded text-white" : "nav-link text-white";
    };

    const {ticker} = useStockData();
    

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-custom-blue"> {/* Change background to blue */}
        <div className="container-fluid">
            {/* Brand/Title */}
            <NavLink className="navbar-brand text-white" to="/search/home">Stock Search</NavLink> {/* Text color changed to white */}

            {/* Toggler/collapsible Button */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navbar links */}
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                <NavLink className={getNavLinkClass} to={ticker ? `/search/${ticker}` : `/search/home`}>Search</NavLink>
                </li>
                <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/watchlist">Watchlist</NavLink>
                </li>
                <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/portfolio">Portfolio</NavLink>
                </li>
            </ul>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;
