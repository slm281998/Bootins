import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const CoursePlayer = () => {
    const { formationId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [enrollments, setEnrollments] = useState([]); // Pour le sidebar des cours
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [, setUser] = useState(null);
    const navigate = useNavigate();

    // Fonction pour transformer un lien YouTube en embed
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Récupérer le profil et tous les cours inscrits pour le sidebar
                const resUser = await api.get('user/profile/');
                setUser(resUser.data);
                
                const resEnroll = await api.get('user/dashboard/');
                setEnrollments(resEnroll.data);

                // 2. Récupérer les détails de la formation actuelle
                const resFormation = await api.get(`formations/${formationId}/`);
                // Note : assure-toi que ton backend Django renvoie les leçons dans l'objet formation
                const lessonList = resFormation.data.lessons || [];
                setLessons(lessonList);
                
                if (lessonList.length > 0) {
                    setCurrentLesson(lessonList[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                navigate('/dashboard');
            }
        };
        fetchData();
    }, [formationId, navigate]);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleComplete = async () => {
    if (!currentLesson || isSubmitting) return;

    setIsSubmitting(true);
    try {
        // Appelle l'API Django
        const res = await api.post(`lessons/${currentLesson.id}/complete/`);
        
        if (res.status === 200 || res.status === 201) {
            // 1. Trouver l'index de la leçon actuelle
            const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
            
            // 2. Vérifier s'il y a une leçon suivante
            if (currentIndex < lessons.length - 1) {
                const nextLesson = lessons[currentIndex + 1];
                setCurrentLesson(nextLesson);
                alert("Bravo ! Passons à la leçon suivante : " + nextLesson.title);
            } else {
                alert("Félicitations ! Vous avez terminé cette formation. Votre certificat est disponible sur le dashboard.");
                navigate('/dashboard');
            }
        }
    } catch (err) {
        console.error("Erreur de validation :", err.response?.data);
        alert("Impossible de valider la leçon. Vérifiez votre connexion.");
    } finally {
        setIsSubmitting(false);
    }
};

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#111827]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#111827] text-white overflow-hidden">
            
            {/* --- SIDEBAR GAUCHE : MES FORMATIONS --- */}
            <div className="w-64 bg-[#1f2937] hidden lg:flex flex-col border-r border-gray-700 shadow-2xl">
                <div className="p-6 border-b border-gray-700">
                    <img 
                        src="http://127.0.0.1:8000/media/formations/covers/logo_bootins.png" 
                        alt="Logo" 
                        className="h-8 mx-auto cursor-pointer" 
                        onClick={() => navigate('/dashboard')}
                    />
                </div>
                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Mes Formations</h4>
                    <div className="space-y-2">
                        {enrollments.map((e) => (
                            <button
                                key={e.id}
                                onClick={() => navigate(`/course/${e.formation.id}`)}
                                className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${
                                    parseInt(formationId) === e.formation.id 
                                    ? 'bg-primary text-white shadow-lg' 
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                {e.formation.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-ghost btn-sm w-full text-gray-400">
                        ← Retour Dashboard
                    </button>
                </div>
            </div>

            {/* --- ZONE PRINCIPALE (LECTEUR) --- */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#111827]">
                <header className="h-16 bg-[#1f2937] border-b border-gray-700 flex items-center px-8">
                    <h2 className="font-bold text-sm truncate uppercase tracking-tight text-primary">
                        Lecture en cours : <span className="text-white">{currentLesson?.title || 'Chargement...'}</span>
                    </h2>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    {currentLesson ? (
                        <div className="max-w-5xl mx-auto space-y-6">
                            
                            {/* Lecteur Vidéo Premium */}
                            {currentLesson.video_url && (
                                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-black">
                                    <iframe 
                                        className="w-full h-full"
                                        src={getEmbedUrl(currentLesson.video_url)} 
                                        title={currentLesson.title}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {/* Contenu de la leçon */}
                            <div className="bg-[#1f2937] p-8 rounded-2xl border border-gray-700 shadow-xl">
                                <h1 className="text-2xl font-black mb-6 uppercase tracking-tighter">{currentLesson.title}</h1>
                                <div className="prose prose-invert max-w-none text-gray-300">
                                    <p className="leading-relaxed">{currentLesson.content}</p>
                                </div>
                                
                                <div className="divider opacity-10 mt-10"></div>
                                
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Bootins Player v2</span>
                                    </div>
                                   <button 
                                        onClick={handleComplete} 
                                        disabled={isSubmitting}
                                        className={`btn btn-primary px-10 font-black rounded-xl shadow-lg transition-all transform hover:scale-105 ${isSubmitting ? 'loading' : ''}`}>
                                        {isSubmitting ? 'VALIDATION...' : 'VALIDER LA LEÇON'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                            <span className="text-6xl mb-4">📖</span>
                            <p className="text-xl font-bold italic">Sélectionnez une leçon pour commencer</p>
                        </div>
                    )}
                </main>
            </div>

            {/* --- SIDEBAR DROITE : SOMMAIRE DES LEÇONS --- */}
            <div className="w-80 bg-[#1f2937] border-l border-gray-700 hidden xl:flex flex-col">
                <div className="p-6 border-b border-gray-700 bg-gray-800/50">
                    <h3 className="font-black text-sm tracking-tighter uppercase">Sommaire du cours</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {lessons.map((lesson, index) => (
                        <button 
                            key={lesson.id}
                            onClick={() => setCurrentLesson(lesson)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                                currentLesson?.id === lesson.id 
                                ? 'bg-primary/20 border border-primary/50 text-white' 
                                : 'hover:bg-gray-800 text-gray-400'
                            }`}
                        >
                            <span className={`text-xs font-black ${currentLesson?.id === lesson.id ? 'text-primary' : 'text-gray-600'}`}>
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold leading-tight">{lesson.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;