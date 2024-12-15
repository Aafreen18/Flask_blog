import React from "react";
import logo from '../assets/logo.png';
import { NavLink } from 'react-router-dom';

const Navbar = (props) =>{
    const { username, userId} = props;
    
    return(
        <>
        <div className="nav-bar align-content-center d-flex justify-content-center align-items-center">
            <div>
                <img src={logo} alt="logo" width="150px" height="80px" />
            </div>

            <div className="d-flex flex-column ms-auto" style={{ marginRight: '10px' }}>
                <div 
                    className="me justify-content-center" 
                    style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: 'white', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '20px', 
                        color: 'orange' 
                    }}
                    >
                    {username && username[0].toUpperCase()}
                </div>

                <div className="dropdown mt-1">
                    <button
                    className="btn btn-light dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{color:'orange'}}
                    >
                    Me
                    </button>

                    <ul className="dropdown-menu">
                    <li className="nav-item text-center fw-bolder">
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? 'nav-link menu-active' : 'nav-link'
                        }
                        to="/profile"
                        state={{ username, userId }} 
                        >
                        View Profile
                        </NavLink>

                    </li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Navbar;