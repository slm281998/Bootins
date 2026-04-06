import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour le menu mobile

    // --- DONNÉES FICTIVES ---
    const categories = [
        { name: "Développement Web", icon: "💻" },
        { name: "Intelligence Artificielle", icon: "🤖" },
        { name: "Marketing Digital", icon: "📈" },
        { name: "Design & UX", icon: "🎨" },
        { name: "Business & Management", icon: "💼" },
        { name: "Cybersécurité", icon: "🔐" },
        { name: "Langues", icon: "🌍" },
        { name: "Bureautique", icon: "📊" },
    ];

    const popularCourses = [
        { id: 1, title: "Bootcamp Développeur Full-Stack React & Node", author: "Marc Dupont", lessons: 42, price: "800TND", category: "Développement", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" },
        { id: 2, title: "Maîtriser ChatGPT et l'IA Générative", author: "Sophie Martin", lessons: 15, price: "Gratuit", category: "IA", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80" },
        { id: 3, title: "Design UI/UX : De zéro à Pro sur Figma", author: "Lucas Bernard", lessons: 28, price: "Gratuit", category: "Design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80" },
        { id: 4, title: "Stratégie Marketing Digital 2024", author: "Emma Leroy", lessons: 20, price: "Gratuit", category: "Marketing", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" },
    ];

    return (
        <div className="min-h-screen bg-base-100 font-sans overflow-x-hidden">
            
            {/* --- NAVBAR RESPONSIVE --- */}
            <nav className="bg-[#1e293b] sticky top-0 z-50 shadow-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0">
                                <img 
                                    src="http://127.0.0.1:8000/media/formations/covers/logo_bootins.png" 
                                    alt="Logo" 
                                    className="h-10 w-auto"
                                    onError={(e) => e.target.src = "https://via.placeholder.com/150x50?text=BOOTINS"}
                                />
                            </Link>
                        </div>

                        {/* Menu Desktop */}
                        <div className="hidden lg:flex items-center space-x-8 text-gray-300 font-semibold">
                            <a href="#" className="hover:text-blue-500 transition-colors">Accueil</a>
                            <a href="#courses" className="hover:text-blue-500 transition-colors">Nos Cours</a>
                            <a href="#categories" className="hover:text-blue-500 transition-colors">Catégories</a>
                            <button onClick={() => navigate('/login')} className="btn btn-ghost text-gray-300 font-bold">Connexion</button>
                            <button onClick={() => navigate('/register')} className="btn bg-blue-600 text-white border-none hover:bg-blue-700 rounded-md px-6">S'inscrire</button>
                        </div>

                        {/* Bouton Burger Mobile */}
                        <div className="lg:hidden flex items-center">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-300 hover:text-white p-2"
                            >
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu Mobile (Dropdown) */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-[#1e293b] border-t border-gray-700 animate-fadeIn">
                        <div className="px-4 pt-4 pb-6 space-y-4 text-center">
                            <a href="#" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 py-2">Accueil</a>
                            <a href="#courses" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 py-2">Nos Cours</a>
                            <a href="#categories" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 py-2">Catégories</a>
                            <div className="divider opacity-20"></div>
                            <button onClick={() => navigate('/login')} className="btn btn-outline btn-block text-white mb-2">Connexion</button>
                            <button onClick={() => navigate('/register')} className="btn bg-blue-600 btn-block text-white border-none">S'inscrire</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full">
                        ⚡ Apprends avec les meilleurs
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                        La Meilleure Plateforme <br />
                        <span className="text-blue-600 italic">Pour Tes Compétences</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0">
                        Commence ton voyage éducatif avec BOOTINS. Des cours de qualité, accessibles partout, pour construire ton avenir dès aujourd'hui.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button onClick={() => navigate('/register')} className="btn bg-blue-600 text-white hover:bg-blue-700 btn-lg rounded-xl px-10 shadow-xl shadow-blue-600/30">
                            Commencer maintenant
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 relative flex justify-center">
                    <div className="relative rounded-full bg-blue-50 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] flex items-end justify-center overflow-hidden border border-blue-100 shadow-inner">
                        <img 
                            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=600&q=80" 
                            alt="Étudiant" 
                            className="object-cover w-full h-full object-top" 
                        />
                    </div>
                </div>
            </section>

            {/* --- CATEGORIES (GRID ADAPTATIF) --- */}
            <section id="categories" className="bg-base-200/50 py-20 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Catégories</h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, index) => (
                            <button key={index} className="group bg-base-100 hover:bg-blue-600 p-6 shadow-sm border border-base-200 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-2">
                                <span className="text-3xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                                <span className="font-bold group-hover:text-white transition-colors">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COURS POPULAIRES --- */}
            <section id="courses" className="max-w-7xl mx-auto px-6 lg:px-8 py-20 scroll-mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 text-center md:text-left">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Cours Populaires</h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto md:mx-0 rounded-full"></div>
                    </div>
                    <button onClick={() => navigate('/login')} className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:border-blue-600">
                        Voir tout le catalogue
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {popularCourses.map((course) => (
                        <div key={course.id} className="card bg-[#1e293b] shadow-2xl border border-gray-800 group hover:ring-2 ring-blue-500 transition-all duration-300">
                            <figure className="relative h-48 overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 badge bg-blue-600 text-white border-none py-3 font-bold">{course.category}</div>
                                <img src={course.image} alt={course.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                            </figure>
                            <div className="card-body p-6">
                                <h3 className="card-title text-lg text-white font-bold leading-snug h-12 mb-4 group-hover:text-blue-400 transition-colors cursor-pointer">
                                    {course.title}
                                </h3>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                    <span className="text-xl font-black text-green-500">{course.price}</span>
                                    <button onClick={() => navigate('/login')} className="text-blue-500 font-bold hover:underline">S'inscrire</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FOOTER SOMBRE --- */}
            <footer id="footer" className="bg-[#0f172a] pt-20 pb-10 px-6 lg:px-8 text-gray-400">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="text-white text-3xl font-black italic tracking-tighter">BOOTINS.</div>
                        <p className="text-sm leading-relaxed">
                            Plateforme de formation nouvelle génération pour transformer votre passion en carrière.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Liens utiles</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Accueil</a></li>
                            <li><a href="#courses" className="hover:text-blue-500 transition-colors">Catalogue</a></li>
                            <li><a href="#categories" className="hover:text-blue-500 transition-colors">Catégories</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Centre d'aide</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Confidentialité</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-2">📍 <span>Sousse, Tunisie</span></li>
                            <li className="flex gap-2">📞 <span>+216 50 123 456</span></li>
                            <li className="flex gap-2">✉️ <span>contact@bootins.com</span></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-gray-800 mt-16 pt-8 text-center text-xs">
                    <p>© {new Date().getFullYear()} BOOTINS. Propulsé par l'innovation.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;