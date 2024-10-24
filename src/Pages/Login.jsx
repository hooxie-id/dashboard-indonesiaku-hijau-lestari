import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import servicesAuth from "../Api/serviceAuth";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [countdown, setCountdown] = useState(5000);
    const queryParams = new URLSearchParams(location.search);
    const [errorMessage, setErrorMessage] = useState(queryParams.get('error'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            servicesAuth.verifyToken(token)
                .then(() => {
                    setIsLoggedIn(true);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                });
        }
    }, []);

    useEffect(() => {
        if (errorMessage) {
            navigate('/', { replace: true });
        }
    }, [errorMessage, navigate]);

    useEffect(() => {
        if (errorMessage) {
            const interval = setInterval(() => {
                setCountdown((prevCountdown) => Math.max(prevCountdown - 100, 0));
            }, 100);

            const timer = setTimeout(() => {
                setErrorMessage('');
                setCountdown(5000);
            }, 5000);

            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }
    }, [errorMessage]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setEmailError('');
        setPasswordError('');
        setErrorMessage('');
        try {
            const response = await servicesAuth.login(email, password);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                setSuccessMessage('Login successful! Redirecting to dashboard...');
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                setErrorMessage('Login failed. No token provided.');
            }
        } catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;
                setEmailError(errorData.email || '');
                setPasswordError(errorData.password || '');
            } else {
                setErrorMessage('Invalid credentials');
            }
            setCountdown(5000);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) {
        return <Navigate to={'/home'} />;
    }

    return (
        <div className="flex h-screen bg-white">
            <div className="w-1/2 flex justify-center items-center mx-auto">
                <form className="space-y-4 w-[500px]" onSubmit={handleLogin}>
                    <div className="font-semibold text-4xl text-black">Welcome back!</div>
                    <div className="font-light text-normal text-black">
                        <p>Enter your credentials to securely access your dashboard and continue where you left off.</p>
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm">
                            {errorMessage} {countdown > 0 && `(Disappearing in ${(countdown / 1000).toFixed(2)} seconds)`}
                        </div>
                    )}

                    {successMessage && (
                        <div className="text-green-500 text-sm">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-950 focus:border-blue-950"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-950 focus:border-blue-950 pr-10"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="form-checkbox text-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#111D29] text-white hover:text-slate-200 font-bold rounded-full hover:bg-[#111D29] hover:bg-opacity-90 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
            <div className="hidden w-1/2 md:flex items-center justify-center bg-cover bg-center bg-[#111D29]">
                <span className="text-white text-3xl font-extrabold">
                    INDONESIAKU HIJAU LESTARI
                </span>
            </div>
        </div>
    );
};

export default Login;
