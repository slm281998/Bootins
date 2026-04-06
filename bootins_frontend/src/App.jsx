import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import AdminDashboard from './pages/AdminDashboard';

// Dans ton fichier App.jsx
const AdminRoute = ({ children }) => {
    // On récupère la valeur. Attention : localStorage stocke des STRINGS.
    const isAdmin = localStorage.getItem('is_admin'); 
    
    // On vérifie si c'est la chaîne "true"
    if (isAdmin === 'true') {
        return children;
    }

    // SI CE N'EST PAS TRUE, ON RESTE SUR LE DASHBOARD
    console.warn("Accès refusé : is_admin vaut", isAdmin);
    return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/course/:formationId" element={<CoursePlayer />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/mes-cours" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;