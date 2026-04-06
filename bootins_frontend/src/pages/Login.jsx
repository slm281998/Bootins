import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post('auth/login/', { email, password });
        console.log("Données reçues de Django :", res.data); // <--- REGARDE BIEN ÇA DANS LA CONSOLE

        // 1. Stockage des tokens
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);

        const isAdminValue = res.data.user ? res.data.user.is_admin : res.data.is_admin;

        if (isAdminValue !== undefined && isAdminValue !== null) {
            // ON STOCK UNE CHAINE DE CARACTERES "true" ou "false"
            localStorage.setItem('is_admin', isAdminValue.toString()); 
            console.log("Stockage réussi :", isAdminValue);
        } else {
            console.error("ERREUR : 'is_admin' est introuvable dans la réponse API !");
        }

        navigate('/dashboard');
        window.location.reload(); // Force le rafraîchissement pour afficher le bouton
    } catch {
        setError("Erreur de connexion.");
    }
};
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-3xl font-bold mb-4 text-primary">Connexion</h2>
                    
                    {error && (
                        <div className="alert alert-error py-2 text-sm shadow-sm">
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input 
                                type="email" 
                                placeholder=" votre email" 
                                className="input input-bordered w-full mt-2 focus:input-primary" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Mot de passe</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="**********" 
                                className="input input-bordered w-full mt-2 focus:input-primary" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="mt-6 flex justify-center w-full">
                            <button type="submit" className="btn btn-primary w-1/2">
                                Se connecter
                            </button>
                        </div>
                        <p className="text-center text-sm mt-4">
                                Pas encore de compte ? <Link to="/register" className="link link-primary font-semibold">S'inscrire</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;