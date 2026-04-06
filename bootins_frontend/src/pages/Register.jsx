import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Utiliser api.post normalement, MAIS on s'assure que Django accepte
            // Si l'erreur 401 persiste, c'est que le problème est 100% côté Django (views.py)
            await api.post('auth/register/', formData);
            
            setSuccess(true);
            
            // On vide le localStorage au cas où un vieux token traîne
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            console.error("Détails erreur inscription:", err.response?.data);
            setError(err.response?.data?.email || "Erreur lors de l'inscription.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-3xl font-bold mb-4 text-primary">Créer un compte</h2>
                    
                    {error && (
                        <div className="alert alert-error py-2 text-sm shadow-sm">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success py-2 text-sm shadow-sm text-white">
                            <span>Compte créé avec succès ! Redirection...</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleRegister} className="flex flex-col gap-3 mt-2">
                        <div className="flex gap-2">
                            <div className="form-control w-1/2">
                                <label className="label"><span className="label-text font-medium">Prénom</span></label>
                                <input type="text" name="first_name" className="input input-bordered w-full mt-2 focus:input-primary" value={formData.first_name} onChange={handleChange} required />
                            </div>
                            <div className="form-control w-1/2">
                                <label className="label"><span className="label-text font-medium">Nom</span></label>
                                <input type="text" name="last_name" className="input input-bordered w-full mt-2 focus:input-primary" value={formData.last_name} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Email</span></label>
                            <input type="email" name="email" className="input input-bordered w-full mt-2 focus:input-primary" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Mot de passe</span></label>
                            <input type="password" name="password" className="input input-bordered w-full mt-2  focus:input-primary" value={formData.password} onChange={handleChange} required minLength="8" />
                        </div>

                        <div className="mt-6 flex flex-col items-center gap-4 w-full">
                            <button type="submit" className="btn btn-primary w-full" disabled={success}>
                                S'inscrire
                            </button>
                            <p className="text-sm">
                                Déjà un compte ? <Link to="/login" className="link link-primary font-semibold">Se connecter</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;