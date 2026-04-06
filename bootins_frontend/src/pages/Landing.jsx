import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    // --- DONNÉES FICTIVES POUR LE DESIGN ---
    const categories = [
        { name: "Business", icon: "💼" },
        { name: "Development", icon: "💻" },
        { name: "Language", icon: "🗣️" },
        { name: "Marketing", icon: "📈" },
        { name: "Finance", icon: "💰" },
        { name: "Design", icon: "🎨" },
        { name: "Photography", icon: "📷" },
        { name: "Office", icon: "📁" },
        { name: "Science", icon: "🔬" },
    ];

    const advantages = [
        { title: "Relevant Skill set", desc: "Apprenez les compétences exactes recherchées par les employeurs d'aujourd'hui." },
        { title: "Growth Mindset", desc: "Développez une mentalité orientée vers la croissance et la résolution de problèmes." },
        { title: "1-on-1 Mentoring", desc: "Bénéficiez d'un accompagnement personnalisé avec nos experts métiers." },
        { title: "Hiring Partners", desc: "Accédez à notre réseau d'entreprises partenaires qui recrutent." },
    ];

    const courses = [
        { id: 1, badge: "Beginner", title: "Adobe Illustrator CC - Advanced Training Course", author: "DracoInstructor", category: "Design", rating: 4.8, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&q=80" },
        { id: 2, badge: "Beginner", title: "Master Course: English Grammar, English Speaking", author: "DracoInstructor", category: "Language", rating: 4.7, image: "https://images.unsplash.com/photo-1546410531-bea4edad646a?auto=format&fit=crop&w=400&q=80" },
        { id: 3, badge: "Beginner", title: "The Complete 2024 Web Development Bootcamp", author: "DracoInstructor", category: "Development", rating: 4.9, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80" },
        { id: 4, badge: "Beginner", title: "The Complete Personal Finance Course", author: "DracoInstructor", category: "Finance", rating: 4.8, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80" },
    ];

    const faqs = [
        { q: "Can I access course materials offline?", a: "Oui, vous pouvez télécharger les vidéos et les PDF via notre application mobile pour une consultation hors ligne." },
        { q: "Is there any prerequisite for courses?", a: "La majorité de nos cours sont conçus pour les débutants. Les prérequis spécifiques sont indiqués sur la page de chaque cours." },
        { q: "How long do I have access to a course?", a: "Une fois inscrit, vous bénéficiez d'un accès à vie au contenu du cours, y compris les futures mises à jour." },
        { q: "How can I make a payment for a course?", a: "Nous acceptons les cartes de crédit, PayPal et les virements bancaires sécurisés." },
        { q: "How can I contact the course instructor?", a: "Vous pouvez utiliser le forum de discussion dédié au cours ou l'assistant IA intégré au tableau de bord." },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            
            {/* --- NAVBAR --- */}
            <div className="navbar bg-white sticky top-0 z-50 px-4 md:px-12 py-4">
                <div className="navbar-start">
                    <a href="#" className="text-3xl font-extrabold text-blue-600 tracking-tight cursor-pointer">BOOTINS<span className="text-green-500">.</span></a>
                </div>
                
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 font-medium text-gray-600 gap-4">
                        <li><a href="#" className="hover:text-blue-600">Home</a></li>
                        <li><a href="#courses" className="hover:text-blue-600">Course</a></li>
                        <li><a href="#bootcamp" className="hover:text-blue-600">Bootcamp</a></li>
                        <li><a href="#" className="hover:text-blue-600">Page</a></li>
                        <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                        <li><a href="#faq" className="hover:text-blue-600">Contact</a></li>
                    </ul>
                </div>
                
                <div className="navbar-end gap-3">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="btn btn-outline btn-sm rounded-full text-blue-600 border-blue-600 hover:bg-blue-600 hover:border-blue-600 px-6 font-semibold"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="btn btn-sm bg-blue-600 text-white border-none hover:bg-blue-700 rounded-full px-6 font-semibold shadow-md shadow-blue-200"
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* --- HERO SECTION --- */}
            <section className="px-4 md:px-12 pt-4">
                <div className="bg-slate-100 rounded-3xl md:rounded-[3rem] px-8 md:px-16 py-12 md:py-0 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
                    <div className="z-10 py-10 md:py-24">
                        <p className="text-sm text-gray-500 font-medium mb-2">Home / <span className="text-gray-400">Bootcamp</span></p>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Bootcamp Program
                        </h1>
                    </div>
                    {/* Image Héro : L'homme au PC */}
                    <div className="w-full md:w-1/2 flex justify-end mt-8 md:mt-0 relative">
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                            alt="Student learning" 
                            className="object-cover w-full h-75 md:h-100 rounded-bl-[4rem]"
                        />
                    </div>
                </div>
            </section>

            {/* --- ICONS CATEGORIES --- */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-blue-100 group-hover:scale-110 transition-all shadow-sm border border-gray-100">
                                {cat.icon}
                            </div>
                            <span className="text-xs font-semibold text-gray-500">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ADVANTAGES SECTION --- */}
            <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 leading-snug">
                        The Advantages of the <br/><span className="text-blue-600">BOOTINS</span> Program.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {advantages.map((adv, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">{adv.title}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">{adv.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-1/2 relative flex justify-center">
                    {/* Fond décoratif bleu clair */}
                    <div className="absolute inset-0 bg-blue-50 rounded-3xl transform rotate-3 scale-95 -z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
                        alt="Advantage" 
                        className="rounded-3xl object-cover h-112.5 shadow-lg border-4 border-white"
                    />
                </div>
            </section>

            {/* --- BOOTCAMP PROGRAM (COURSES) --- */}
            <section id="bootcamp" className="py-16 px-4 md:px-12">
                <div className="max-w-7xl mx-auto bg-blue-50/50 rounded-[3rem] p-8 md:p-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Bootcamp Program</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                                <div className="relative h-36 rounded-xl overflow-hidden mb-4">
                                    <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                        {course.badge}
                                    </div>
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 px-1">
                                    <h3 className="font-bold text-sm text-gray-900 leading-tight mb-2 h-10">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 mb-3">By {course.author} in <span className="text-gray-600">{course.category}</span></p>
                                    <div className="flex items-center gap-1 mb-4">
                                        <span className="text-yellow-400 text-xs">★★★★★</span>
                                        <span className="text-xs font-bold text-gray-600">{course.rating}</span>
                                    </div>
                                </div>
                                <button onClick={() => navigate('/login')} className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors">
                                    Start Learning
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4 FEATURES ICONS --- */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    {[
                        { title: "CV & Resume Prep", icon: "📄" },
                        { title: "Interview Coaching", icon: "🤝" },
                        { title: "Buddy System", icon: "👥" },
                        { title: "Career Opportunity", icon: "🚀" }
                    ].map((feat, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mb-4">
                                {feat.icon}
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">{feat.title}</h4>
                            <p className="text-xs text-gray-400 px-4">Bénéficiez d'un accompagnement personnalisé pour atteindre vos objectifs.</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-16 px-4 max-w-3xl mx-auto mb-10">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="collapse collapse-arrow bg-white border border-gray-200 rounded-xl">
                            {/* Le premier est ouvert par défaut */}
                            <input type="radio" name="my-accordion-faq" defaultChecked={idx === 0} /> 
                            <div className="collapse-title text-sm font-semibold text-gray-800">
                                {faq.q}
                            </div>
                            <div className="collapse-content"> 
                                <p className="text-xs text-gray-500">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <a href="#" className="font-bold text-gray-900 hover:text-blue-600 underline text-sm">www.bootins-learning.com</a>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-gray-200 pt-16 pb-8 px-4 md:px-12 mt-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                    {/* Colonne Logo & Contact */}
                    <div className="md:col-span-1">
                        <a href="#" className="text-3xl font-extrabold text-blue-600 tracking-tight block mb-6">BOOTINS<span className="text-green-500">.</span></a>
                        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                            <span className="text-green-500 text-xl">💬</span>
                            <div>
                                <p className="font-bold text-gray-800">WhatsApp</p>
                                <p>0812 8090 9526</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="text-yellow-500 text-xl">✉️</span>
                            <div>
                                <p className="font-bold text-gray-800">Email</p>
                                <p>contact@bootins.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Colonnes Liens */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-blue-600">About</a></li>
                            <li><a href="#" className="hover:text-blue-600">What We Offer</a></li>
                            <li><a href="#" className="hover:text-blue-600">Our Course</a></li>
                            <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Teaching</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-blue-600">Become a Teacher</a></li>
                            <li><a href="#" className="hover:text-blue-600">Teacher Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-600">Rules & Requirements</a></li>
                            <li><a href="#" className="hover:text-blue-600">Leadership</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Community</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-blue-600">Learners</a></li>
                            <li><a href="#" className="hover:text-blue-600">Partners</a></li>
                            <li><a href="#" className="hover:text-blue-600">Blog & News</a></li>
                            <li><a href="#" className="hover:text-blue-600">Team Plans</a></li>
                        </ul>
                    </div>

                    {/* Colonne Socials */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Connect with us</h4>
                        <div className="flex gap-2 mb-6">
                            <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">f</button>
                            <button className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center">t</button>
                            <button className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center">ig</button>
                            <button className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center">in</button>
                        </div>
                        <div className="flex gap-2">
                            {/* Placeholder pour les badges Google Play / App Store */}
                            <div className="bg-black text-white text-[10px] px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer">
                                <span>▶</span> Google Play
                            </div>
                            <div className="bg-black text-white text-[10px] px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer">
                                <span></span> App Store
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bas du footer */}
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6 text-[10px] text-gray-400">
                    <div className="flex gap-4 mb-4 md:mb-0">
                        <a href="#">Privacy Practices</a>
                        <a href="#">Disclaimer</a>
                        <a href="#">Accessibility</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Sitemap</a>
                    </div>
                    <p>Copyright © 2024 Bootins | Powered by React & Django</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;