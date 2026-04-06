import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
    // --- ÉTATS (STATES) ---
    const [activeTab, setActiveTab] = useState('formations');
    const [formations, setFormations] = useState([]);
    const [users, setUsers] = useState([]);
    
    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // Données Formulaires
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [newLesson, setNewLesson] = useState({ title: '', content: '', video_url: '', order: 1 });
    const [newFormation, setNewFormation] = useState({ title: '', description: '', cover: null });
    const [newModule, setNewModule] = useState({ title: '', formation: '', order: 1 });
    const [userData, setUserData] = useState({ first_name: '', last_name: '', email: '', password: '' });

    const navigate = useNavigate();

    // --- CHARGEMENT DES DONNÉES ---
    const fetchData = async () => {
        try {
            const resFormations = await api.get('formations/');
            setFormations(resFormations.data);
            const resUsers = await api.get('admin/users/');
            setUsers(resUsers.data);
        } catch (err) {
            console.error("Erreur de chargement admin :", err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    // --- ACTIONS UTILISATEURS ---
    const handleToggleAdmin = async (userId, currentStatus) => {
        try {
            await api.patch(`admin/users/${userId}/role/`, { is_admin: !currentStatus });
            fetchData();
        } catch { alert("Erreur lors du changement de rôle."); }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Supprimer cet utilisateur définitivement ?")) {
            try {
                await api.delete(`admin/users/${userId}/delete/`);
                fetchData();
            } catch { alert("Erreur lors de la suppression."); }
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await api.patch(`admin/users/${selectedUser.id}/update/`, userData);
                alert("Utilisateur mis à jour !");
            } else {
                await api.post('admin/users/create/', userData);
                alert("Utilisateur créé !");
            }
            setIsUserModalOpen(false);
            setUserData({ first_name: '', last_name: '', email: '', password: '' });
            fetchData();
        } catch { alert("Erreur lors de l'opération utilisateur."); }
    };

    // --- ACTIONS FORMATIONS (AVEC IMAGE) ---
    const handleCreateFormation = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newFormation.title);
        formData.append('description', newFormation.description);
        if (newFormation.cover) {
            formData.append('cover', newFormation.cover);
        }

        try {
            await api.post('formations/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsFormationModalOpen(false);
            setNewFormation({ title: '', description: '', cover: null });
            fetchData();
            alert("Formation créée !");
        } catch { alert("Erreur lors de la création."); }
    };

    // --- ACTIONS MODULES ---
    const handleCreateModule = async (e) => {
        e.preventDefault();
        try {
            await api.post('admin/modules/create/', newModule);
            setIsModuleModalOpen(false);
            setNewModule({ title: '', formation: '', order: 1 });
            fetchData();
            alert("Module ajouté !");
        } catch { alert("Erreur création module."); }
    };

    // --- ACTIONS LEÇONS ---
    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...newLesson, module: selectedModuleId };
            await api.post('admin/lessons/create/', dataToSend);
            setIsModalOpen(false);
            setNewLesson({ title: '', content: '', video_url: '', order: 1 });
            fetchData();
            alert("Leçon ajoutée !");
        } catch { alert("Erreur : Vérifiez le module."); }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#111827] text-white overflow-hidden font-sans">
            
            {/* --- SIDEBAR --- */}
            <div className="w-72 bg-[#1f2937] hidden md:flex flex-col border-r border-gray-700 shadow-2xl">
                <div className="p-8 flex justify-center">
                    <img src="http://127.0.0.1:8000/media/formations/covers/logo_bootins.png" alt="BOOTINS" className="h-12 w-auto object-contain cursor-pointer" onClick={() => navigate('/dashboard')} />
                </div>
                <nav className="flex-1 px-4 space-y-3 mt-6">
                    <Link to="/dashboard" className="btn btn-ghost justify-start w-full gap-4 text-gray-400 border-none normal-case">
                        <span className="text-xl">🏠</span> Dashboard Élève
                    </Link>
                    <div className="divider opacity-10 px-4 text-[10px] uppercase font-black tracking-widest text-primary">Gestion Admin</div>
                    <button onClick={() => setActiveTab('formations')} className={`btn btn-ghost justify-start w-full gap-4 normal-case border-none ${activeTab === 'formations' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>
                        <span className="text-xl">📚</span> Formations & Contenu
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`btn btn-ghost justify-start w-full gap-4 normal-case border-none ${activeTab === 'users' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>
                        <span className="text-xl">👥</span> Utilisateurs & Rôles
                    </button>
                </nav>
                <div className="p-6 border-t border-gray-700">
                    <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm w-full rounded-lg">Déconnexion</button>
                </div>
            </div>

            {/* --- CONTENU PRINCIPAL --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-[#1f2937] border-b border-gray-700 flex items-center justify-between px-8 shadow-sm">
                    <div className="font-black text-xl tracking-tighter text-primary uppercase italic">Console d'administration</div>
                    <div className="badge badge-warning font-black p-3 text-[10px] tracking-widest">ADMINISTRATEUR</div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    
                    {/* --- ONGLET : FORMATIONS --- */}
                    {activeTab === 'formations' && (
                        <div className="animate-fadeIn space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-black italic border-l-4 border-primary pl-4 uppercase">Catalogue</h3>
                                <button onClick={() => setIsFormationModalOpen(true)} className="btn btn-primary btn-sm rounded-full">+ Créer Formation</button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {formations.map((f) => (
                                    <div key={f.id} className="bg-[#1f2937] border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
                                        <div className="p-6 bg-gray-800/50 flex justify-between items-center border-b border-gray-700">
                                            <div className="flex items-center gap-4">
                                                {f.cover && <img src={f.cover} alt="cover" className="w-12 h-12 rounded-lg object-cover border border-gray-600" />}
                                                <h4 className="text-xl font-bold text-white uppercase">{f.title}</h4>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setNewModule({...newModule, formation: f.id}); setIsModuleModalOpen(true); }} className="btn btn-info btn-xs text-white">+ Ajouter Module</button>
                                                <span className="badge badge-primary font-black text-[10px]">{f.modules ? f.modules.length : 0} MODULES</span>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {f.modules && f.modules.map((module) => (
                                                <div key={module.id} className="bg-[#111827] p-5 rounded-2xl border border-gray-800">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h5 className="font-extrabold text-sm text-primary uppercase">📦 {module.title}</h5>
                                                        <button onClick={() => { setSelectedModuleId(module.id); setIsModalOpen(true); }} className="btn btn-success btn-xs text-white rounded-lg">+ Ajouter Leçon</button>
                                                    </div>
                                                    <ul className="space-y-2 mt-2">
                                                        {module.lessons && module.lessons.map((lesson, idx) => (
                                                            <li key={lesson.id} className="text-xs text-gray-400 bg-gray-800 p-2 rounded flex justify-between">
                                                                <span>{idx + 1}. {lesson.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- ONGLET : UTILISATEURS --- */}
                    {activeTab === 'users' && (
                        <div className="animate-fadeIn space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black italic border-l-4 border-primary pl-4 uppercase">Gestion des membres</h3>
                                <button onClick={() => { setSelectedUser(null); setUserData({ first_name: '', last_name: '', email: '', password: '' }); setIsUserModalOpen(true); }} className="btn btn-primary btn-sm rounded-full">
                                    + Nouvel Utilisateur
                                </button>
                            </div>
                            <div className="bg-[#1f2937] rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
                                <table className="table w-full">
                                    <thead className="bg-gray-800">
                                        <tr className="text-primary uppercase text-[10px] tracking-widest border-b border-gray-700">
                                            <th className="py-4 px-6 text-left">Utilisateur</th>
                                            <th className="py-4 px-6 text-left">Rôle Actuel</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-300">
                                        {users.map(u => (
                                            <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="font-bold">{u.first_name} {u.last_name}</div>
                                                    <div className="text-[10px] opacity-40 italic">{u.email}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`badge font-black text-[9px] px-3 py-3 ${u.is_admin ? 'badge-warning border-none text-black' : 'bg-gray-700 text-gray-400 border-none'}`}>
                                                        {u.is_admin ? 'ADMINISTRATEUR' : 'APPRENANT'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex justify-end items-center gap-4">
                                                        <button onClick={() => { setSelectedUser(u); setUserData(u); setIsUserModalOpen(true); }} className="text-info hover:underline text-xs font-bold">Modifier</button>
                                                        <button onClick={() => handleToggleAdmin(u.id, u.is_admin)} className={`btn btn-xs font-black px-4 rounded-full border-none ${u.is_admin ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'btn-primary'}`}>
                                                            {u.is_admin ? 'RÉVOQUER' : 'NOMMER ADMIN'}
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(u.id)} className="btn btn-xs btn-outline btn-error rounded-full px-4">Supprimer</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* --- MODALES --- */}

            {/* Formation (avec Photo) */}
            {isFormationModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box bg-[#1f2937] border-2 border-primary text-white rounded-3xl">
                        <h3 className="font-black text-xl mb-6 text-primary uppercase">📚 Créer une formation</h3>
                        <form onSubmit={handleCreateFormation} className="space-y-4">
                            <input type="text" placeholder="Titre" className="input input-bordered w-full bg-[#111827]" value={newFormation.title} onChange={(e) => setNewFormation({...newFormation, title: e.target.value})} required />
                            <textarea placeholder="Description" className="textarea textarea-bordered w-full bg-[#111827]" value={newFormation.description} onChange={(e) => setNewFormation({...newFormation, description: e.target.value})} />
                            <div className="form-control w-full">
                                <label className="label text-[10px] font-bold text-gray-500 uppercase">Photo de couverture</label>
                                <input type="file" className="file-input file-input-bordered file-input-primary w-full bg-[#111827]" onChange={(e) => setNewFormation({...newFormation, cover: e.target.files[0]})} />
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsFormationModalOpen(false)}>Fermer</button>
                                <button type="submit" className="btn btn-primary btn-sm px-10 rounded-full">CRÉER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Module (avec Order) */}
            {isModuleModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box bg-[#1f2937] border-2 border-info text-white rounded-3xl">
                        <h3 className="font-black text-xl mb-6 text-info uppercase">📦 Nouveau Module</h3>
                        <form onSubmit={handleCreateModule} className="space-y-4">
                            <input type="text" placeholder="Titre du module" className="input input-bordered w-full bg-[#111827]" value={newModule.title} onChange={(e) => setNewModule({...newModule, title: e.target.value})} required />
                            <input type="number" placeholder="Ordre" className="input input-bordered w-full bg-[#111827]" value={newModule.order} onChange={(e) => setNewModule({...newModule, order: e.target.value})} />
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsModuleModalOpen(false)}>Fermer</button>
                                <button type="submit" className="btn btn-info btn-sm px-10 text-white rounded-full">AJOUTER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Utilisateur */}
            {isUserModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box bg-[#1f2937] border-2 border-primary text-white rounded-3xl">
                        <h3 className="font-black text-xl mb-6 text-primary uppercase">{selectedUser ? "Modifier" : "Nouveau Membre"}</h3>
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                            <input type="text" placeholder="Prénom" className="input input-bordered w-full bg-[#111827]" value={userData.first_name} onChange={(e) => setUserData({...userData, first_name: e.target.value})} required />
                            <input type="text" placeholder="Nom" className="input input-bordered w-full bg-[#111827]" value={userData.last_name} onChange={(e) => setUserData({...userData, last_name: e.target.value})} required />
                            <input type="email" placeholder="Email" className="input input-bordered w-full bg-[#111827]" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} required />
                            {!selectedUser && <input type="password" placeholder="Mot de passe" className="input input-bordered w-full bg-[#111827]" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} required />}
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsUserModalOpen(false)}>Fermer</button>
                                <button type="submit" className="btn btn-primary btn-sm px-10 rounded-full">{selectedUser ? "Mettre à jour" : "Créer"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Leçon */}
            {isModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box bg-[#1f2937] border-2 border-primary text-white rounded-3xl">
                        <h3 className="font-black text-xl mb-6 text-primary uppercase">🎬 Nouvelle Leçon</h3>
                        <form onSubmit={handleAddLesson} className="space-y-4">
                            <input type="text" placeholder="Titre" className="input input-bordered w-full bg-[#111827]" value={newLesson.title} onChange={(e) => setNewLesson({...newLesson, title: e.target.value})} required />
                            <input type="url" placeholder="Lien YouTube" className="input input-bordered w-full bg-[#111827]" value={newLesson.video_url} onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})} />
                            <textarea placeholder="Contenu" className="textarea textarea-bordered w-full bg-[#111827]" value={newLesson.content} onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}></textarea>
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>Fermer</button>
                                <button type="submit" className="btn btn-primary btn-sm px-10 rounded-full">AJOUTER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;