"use client";
import React, { useEffect, useState } from "react";
import "../Styles/LoginPage.css";
import { useRouter } from "next/navigation";
import { login, register, verifyToken } from "../services/Api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await verifyToken(token);
      if (
        data.success &&
        data.user &&
        (data.user.designation === "admin" || data.user.designation === "author")
      ) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/posts");
      } else {
        localStorage.clear();
      }
    };
    checkLogin();
  }, [router]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(null);

    const email = event.target.username.value;
    const password = event.target.password.value;
    const data = await login({ email, password });

    if (data.success && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("designation", data.user.designation);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/posts");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.username.value;
    const password = e.target.password.value;
    const data = await register({ name, email, password });
    if (data.success) setIsRegistering(false);
  };

  useEffect(() => {
    const container = document.querySelector(".login-wrapper");
    if (!container) return;

    for (let i = 0; i < 80; i++) {
      const dot = document.createElement("div");
      dot.classList.add("shiny-dot");
      dot.style.top = `${Math.random() * 100}vh`;
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.width = dot.style.height = `${Math.random() * 3 + 2}px`;
      dot.style.animationDuration = `${Math.random() * 3 + 2}s`;
      dot.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(dot);
    }
  }, []);
  useEffect(() => {
    document.body.style.backgroundColor = "#131D4F";
    return () => {
      document.body.style.backgroundColor = "";
    };
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

              <div className="form-group password-group" style={{ position: "relative" }}>
                <label htmlFor="password">Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  style={{
                    paddingRight: "35px",
                    borderColor: loginError ? "red" : undefined,
                    borderWidth: loginError ? "2px" : undefined,
                  }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "75%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#888",
                    fontSize: "1.2rem",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
                {loginError && (
                  <p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>
                    {loginError}
                  </p>
                )}
              </div>

              <button type="submit">{isRegistering ? "Register" : "Log in"}</button>
            </div>

            <div className="register-link">
              {isRegistering ? (
                <p style={{ color: "black" }}>
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsRegistering(false)}
                    style={{ cursor: "pointer", color: "#4caf50" }}
                  >
                    Login
                  </span>
                </p>
              ) : (
                <p style={{ color: "black" }}>
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setIsRegistering(true)}
                    style={{ cursor: "pointer", color: "#4caf50" }}
                  >
                    Register
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
