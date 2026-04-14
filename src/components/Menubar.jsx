import React from 'react'
import logoHome from '../assets/Logo_home.png';

const Menubar = () => {
    return (
        <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
                <img src={logoHome} alt="logo" width={32} height={32} />
                <span className="fw-bold fs-4 text-dark">Authify</span>
            </div>
        </nav>

    )
}

export default Menubar
