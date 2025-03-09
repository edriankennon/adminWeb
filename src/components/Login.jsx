import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { user, signIn } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setErrorMessage('Please enter your email and password.');
            return;
        }

        try {
            await signIn(email, password);
            setErrorMessage('');
            navigate('/manage-users');
        } catch (error) {
            console.error('Sign in error:', error);
            setErrorMessage('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="form-section">
                    <img
                        src={require('../assets/Exploredamilag.png')}
                        alt="Explore Damilag Logo"
                        className="image-logo"
                    />
                    <h2>Sign In</h2>
                    <p>Please sign in to continue</p>
                    <form onSubmit={handleSignIn}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Enter your email"
                        />
                        <div className="password-container">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-label="Enter your password"
                            />
                            <span
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                role="button"
                                aria-label="Toggle password visibility"
                            >
                                {passwordVisible ? 'HIDE' : 'SHOW'}
                            </span>
                        </div>
                        <div className="options-container">
                            <label className="remember-me">
                                <input type="checkbox" aria-label="Remember me" /> Remember me
                            </label>
                            <a href="/forgot-password" className="forgot-password">
                                Forgot Password?
                            </a>
                        </div>
                        <button type="submit" className="sign-in-button">
                            Sign in
                        </button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

