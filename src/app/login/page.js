"use client";
import React, { useEffect, useState } from "react";
import "../Styles/login.css";
import { useRouter } from "next/navigation";
import { login, register, verifyToken } from "../services/Api";

const LoginPage = () => {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const data = await verifyToken(token);
            if (data.success) {
                if (data.user.designation === "admin") {
                    router.push("/posts");
                } else if (data.user.designation === "author") {
                    router.push("/posts");
                }
            } else {
                localStorage.clear();
            }
        };
        checkLogin();
    }, [router]);

    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.username.value;
        const password = event.target.password.value;
        const data = await login({ email, password });

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("designation", data.user.designation);
            if (data.user.designation === "admin") {
                router.push("/posts");
            } else if (data.user.designation === "author") {
                router.push("/posts");
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.username.value;
        const password = e.target.password.value;
        const data = await register({ name, email, password });

        if (data.success) {
            alert("Registered successfully! Please login.");
            setIsRegistering(false);
        } else {
            alert(data.message || "Registration failed");
        }
    };

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
                    <form
                        className="login-form"
                        onSubmit={isRegistering ? handleRegister : handleLogin}
                    >
                        <h2 className="login-title">{isRegistering ? "Register" : "Login"}</h2>

                        <div className="inline-form">
                            {isRegistering && (
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Enter your name"
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="username">Email:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button type="submit">{isRegistering ? "Register" : "Log in"}</button>
                        </div>

                        <div className="register-link">
                            {isRegistering ? (
                                <p>
                                    Already have an account?{" "}
                                    <span onClick={() => setIsRegistering(false)}>Login</span>
                                </p>
                            ) : (
                                <p>
                                    New user?{" "}
                                    <span onClick={() => setIsRegistering(true)}>Register</span>
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
