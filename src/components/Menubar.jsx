import React from 'react'
import logoHome from '../assets/Logo_home.png';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/useAppContext';

const Menubar = () => {

    const navigate = useNavigate();
    const { isAuthenticated, userEmail, user } = useAppContext();
    const displayEmail = user?.email || userEmail || '';
    const emailInitial = displayEmail ? displayEmail.charAt(0).toUpperCase() : 'U';

    return (
        <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
                <img src={logoHome} alt="logo" width={32} height={32} />
                <span className="fw-bold fs-4 text-dark">Authify</span>
            </div>

            {!isAuthenticated ? (
                <div className="btn btn-outline-dark rounded-pill px-3" onClick={() => navigate("/login")}>
                    Login <i className="bi bi-arrow-right ms-2"></i>
                </div>
            ) : (
                <div className="d-flex align-items-center">
                    <div
                        className="d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#4a3fd8',
                            fontSize: '0.95rem',
                        }}
                    >
                        {emailInitial}
                    </div>
                </div>
            )}
        </nav>

    )
}

export default Menubar
