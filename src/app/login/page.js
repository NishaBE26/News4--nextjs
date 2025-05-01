"use client";
import React from 'react';
import "../Styles/login.css";
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = (event) => {
        event.preventDefault();
        router.push('/posts');
    };

    const handleRegister = () => {
        router.push('/login/register');
    };

    return (
        <div className="login-wrapper">
            <div className="login-page">
                <div className="right-panel">
                    <form className="login-form" onSubmit={handleLogin}>
                        <h2 className='login-title'>Login</h2>
                        <div className="inline-form">
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input type="text" id="username" name="username" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" name="password" />
                            </div>
                            <button type="submit">Log in</button>
                        </div>
                        <p className="register-link">
                            New user? <span onClick={handleRegister} style={{ color: '#4caf50', cursor: 'pointer',fontWeight:"bold" }}>Register</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
