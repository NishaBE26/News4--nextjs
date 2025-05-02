"use client";
import React, { useEffect } from 'react';
import "../Styles/login.css";
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = (event) => {
        event.preventDefault();
        router.push('/posts');
    };

    // Inject stars on mount
    useEffect(() => {
        const container = document.querySelector(".login-wrapper");
        if (!container) return;

        for (let i = 0; i < 60; i++) {
            const star = document.createElement("div");
            star.classList.add("star");
            star.style.top = `${Math.random() * 100}vh`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.animationDuration = `${Math.random() * 3 + 1}s`;
            container.appendChild(star);
        }
    }, []);

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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
