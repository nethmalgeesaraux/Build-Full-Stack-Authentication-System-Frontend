import React from 'react'
import logoHome from '../assets/Logo_home.png';
import { useNavigate } from 'react-router-dom';

const Menubar = () => {

    const navigate = useNavigate();

    return (
        <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
                <img src={logoHome} alt="logo" width={32} height={32} />
                <span className="fw-bold fs-4 text-dark">Authify</span>
            </div>

            <div className="btn btn-outline-dark rounded-pill px-3" onClick={()=> navigate("/Login")}>
                Login <i className="bi bi-arrow-right ms-2"></i>
            </div>
        </nav>

    )
}

export default Menubar
