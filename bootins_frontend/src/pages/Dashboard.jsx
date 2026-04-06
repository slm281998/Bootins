import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [allFormations, setAllFormations] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState('');
    const navigate = useNavigate();
    
    // --- ÉTATS CHATBOT ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([{ role: 'bot', text: 'Bonjour ! Je suis ton assistant BOOTINS. Comment puis-je t\'aider ?' }]);
    const [isTyping, setIsTyping] = useState(false);

    const catalogRef = useRef(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/400x200?text=Pas+d'image";
        
        // Si l'image est déjà une URL complète (http...), on la garde
        if (imagePath.startsWith('http')) return imagePath;
        
        // Sinon, on ajoute l'adresse du serveur Django
        // ATTENTION : vérifie bien que c'est le port 8000
        return `http://127.0.0.1:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) { navigate('/login'); return; }
        try {
            const resUser = await api.get('user/profile/');
            setUser(resUser.data);
            const resDash = await api.get('user/dashboard/');
            setEnrollments(resDash.data);
            const resAll = await api.get('formations/');
            setAllFormations(resAll.data);
            setLoading(false);
        } catch (err) {
            setError("Session expirée.");
            setLoading(false);
            if (err.response?.status === 401) navigate('/login');
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchDashboardData(); }, [navigate]);

    // --- LOGIQUE INSCRIPTION ---
    const handleEnroll = async (formationId) => {
        try {
            await api.post(`formations/${formationId}/enroll/`);
            fetchDashboardData();
        } catch { alert("Erreur lors de l'inscription."); }
    };

    // --- LOGIQUE CERTIFICAT PDF ---
    const downloadCertificate = async (enrollmentId, title) => {
        try {
            const response = await api.get(`enrollment/${enrollmentId}/certificate/`, {
                responseType: 'blob', 
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificat_${title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            alert("Erreur lors du téléchargement du certificat.");
        }
    };

    // --- LOGIQUE CHATBOT ---
    const sendMessage = async () => {
        if (!chatInput.trim()) return;
        
        const userMsg = { role: 'user', text: chatInput };
        // 1. On affiche le message de l'utilisateur immédiatement
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);

        try {
            const response = await api.post('chatbot/', { message: chatInput });
            // 2. On ajoute la réponse du bot à la suite
            setMessages(prev => [...prev, { role: 'bot', text: response.data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'bot', text: "Erreur de connexion avec l'IA." }]);
        } finally { 
            setIsTyping(false); 
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#111827] text-white">Chargement...</div>;

    return (
        <div className="flex h-screen bg-[#111827] text-white overflow-hidden font-sans">
            
            {/* --- SIDEBAR --- */}
            <div className="w-72 bg-[#1f2937] hidden md:flex flex-col border-r border-gray-700 shadow-2xl">
                <div className="p-8 flex justify-center">
                    <img src="http://127.0.0.1:8000/media/formations/covers/logo_bootins.png" alt="BOOTINS" className="h-12 w-auto" />
                </div>
                <nav className="flex-1 px-4 space-y-3 mt-6">
                    <Link to="/dashboard" className="btn btn-ghost justify-start w-full gap-4 bg-gray-700 text-white normal-case border-none">🏠 Tableau de bord</Link>
                    <button onClick={() => catalogRef.current.scrollIntoView({behavior:'smooth'})} className="btn btn-ghost justify-start w-full gap-4 text-gray-300 normal-case border-none">📚 Catalogue</button>
                    {/* VERSION LIEN DIRECT (Plus sûr que navigate) */}
                    {user?.is_admin && (
                        <Link 
                            to="/admin-dashboard" 
                            className="btn btn-warning btn-outline justify-start w-full gap-4 mt-10 font-bold"
                        >
                            <span>⚙️</span> Administration
                        </Link>
                    )}
                </nav>
                <div className="p-6 border-t border-gray-700">
                    <button onClick={() => {localStorage.clear(); navigate('/login');}} className="btn btn-outline btn-error btn-sm w-full">Déconnexion</button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-[#1f2937] border-b border-gray-700 flex items-center justify-between px-8">
                    <div className="text-gray-400 italic">Bienvenue, <span className="text-white font-bold">{user?.first_name}</span> 👋</div>
                    <div className="flex items-center gap-5">
                        <div className="text-right hidden sm:block">
                            <p className="font-bold text-sm leading-none">{user?.first_name} {user?.last_name}</p>
                            <span className="text-[10px] text-primary font-black uppercase">{user?.is_admin ? 'Admin' : 'Apprenant'}</span>
                        </div>
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center font-black">{user?.first_name?.charAt(0)}</div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    
                    {/* SECTION : MES COURS */}
                    <section className="mb-14">
                        <h3 className="text-3xl font-black italic mb-8 border-l-4 border-primary pl-4 uppercase">Mes cours actifs</h3>
                        {enrollments.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {enrollments.map((e) => (
                                    <div key={e.id} className="card card-side bg-[#1f2937] border border-gray-700 shadow-xl overflow-hidden">
                                        <figure className="w-32 sm:w-48"><img src={getImageUrl(e.formation.cover_image)} alt="cover" className="object-cover h-full" /></figure>
                                        <div className="card-body p-5">
                                            <h2 className="card-title text-lg font-bold uppercase">{e.formation.title}</h2>
                                            <progress className="progress progress-primary w-full h-2" value={e.progress_percentage} max="100"></progress>
                                           {/* SECTION : MES COURS (DANS LE MAPPING) */}
                                            <div className="card-actions justify-end mt-4 flex flex-row gap-2">
                                                {e.is_completed && (
                                                    <button 
                                                        onClick={() => downloadCertificate(e.id, e.formation.title)} 
                                                        className="btn btn-secondary btn-sm flex-1 lg:flex-none px-4 font-bold uppercase text-[10px]"
                                                    >
                                                        📄 Certificat
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => navigate(`/course/${e.formation.id}`)} 
                                                    className="btn btn-primary btn-sm flex-1 lg:flex-none px-6 font-black uppercase text-[10px]"
                                                >
                                                    {e.is_completed ? 'REVOIR' : 'CONTINUER'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#1f2937] p-12 rounded-3xl text-center border-2 border-dashed border-gray-700 opacity-50">Aucun cours actif pour le moment.</div>
                        )}
                    </section>

                    {/* SECTION : CATALOGUE */}
                    <section ref={catalogRef} className="pt-10">
                        <h3 className="text-3xl font-black italic mb-8 border-l-4 border-secondary pl-4 uppercase opacity-80">Découvrir le catalogue</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allFormations.filter(f => !enrollments.some(e => e.formation.id === f.id)).map(f => (
                                <div key={f.id} className="card bg-[#1f2937] border border-gray-700 hover:scale-105 transition-transform duration-300 shadow-xl">
                                    <figure className="h-40 bg-gray-900">
                                        <img 
                                            src={getImageUrl(f.cover_image || f.cover)} 
                                            alt={f.title} 
                                            className="object-cover h-full w-full opacity-90 transition-opacity hover:opacity-100" 
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Image+Non+Trouvée"; }}
                                        />
                                    </figure>
                                    <div className="card-body p-5">
                                        <h4 className="font-bold text-md mb-4">{f.title}</h4>
                                        <button onClick={() => handleEnroll(f.id)} className="btn btn-secondary btn-sm w-full font-bold uppercase">S'inscrire</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            {/* --- WIDGET CHATBOT IA --- */}
            <div className="fixed bottom-6 right-6 z-50">
                {isChatOpen ? (
                    <div className="card w-80 bg-[#1f2937] shadow-2xl border border-primary h-96 flex flex-col text-white">
                        <div className="bg-primary p-3 rounded-t-xl flex justify-between items-center font-bold text-sm">
                            <span>Assistant IA BOOTINS</span>
                            <button onClick={() => setIsChatOpen(false)} className="text-white">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                            {messages.map((m, i) => (
                                <div key={i} className={`chat ${m.role === 'bot' ? 'chat-start' : 'chat-end'}`}>
                                    <div className={`chat-bubble ${m.role === 'bot' ? 'bg-gray-700' : 'bg-primary text-white'}`}>{m.text}</div>
                                </div>
                            ))}
                            {isTyping && <span className="loading loading-dots loading-xs"></span>}
                        </div>
                        <div className="p-3 border-t border-gray-700 flex gap-2">
                            <input type="text" className="input input-bordered input-sm w-full bg-gray-800" value={chatInput} onChange={(e)=>setChatInput(e.target.value)} onKeyDown={(e)=>e.key === 'Enter' && sendMessage()} />
                            <button onClick={sendMessage} className="btn btn-primary btn-sm">OK</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setIsChatOpen(true)} className="btn btn-primary btn-circle btn-lg shadow-lg animate-bounce font-black text-xl">IA</button>
                )}
            </div>
        </div>
    );
};

export default Dashboard;