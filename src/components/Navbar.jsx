import { NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css"; 

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="site-nav">
      <NavLink className="brand" to="/">
        mellemrum<span>.</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Events</NavLink>

        <NavLink to="/om">Om Mellemrum</NavLink>

        {isAuthenticated ? (
          <button type="button" className="logout-button" onClick={logout}>
            Log ud
          </button>
        ) : (
          <NavLink className="login-link" to="/login" state={{ from: "/" }}>
            Log ind
          </NavLink>
        )}
      </div>
    </nav>
  );
} 
