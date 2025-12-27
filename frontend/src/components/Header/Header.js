import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./header.module.css";

export default function Header() {
  const navigate = useNavigate();

  // MVP auth check
  const vendorId = localStorage.getItem("vendorId");

  const cartCount = JSON.parse(localStorage.getItem("cart"))?.length || 0;

  const handleLogout = () => {
    localStorage.removeItem("vendorId");
    navigate("/");
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>
          Munch
        </Link>

        <nav>
          <ul>
            {/* Vendor auth */}
            {!vendorId ? (
              <li>
                <Link to="/vendor/login">Vendor Login</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to={`/vendor/dashboard/${vendorId}`}>Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className={classes.logout}>
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Cart */}
            <li>
              <Link to="/cart">
                Cart
                {cartCount > 0 && (
                  <span className={classes.cart_count}>{cartCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
