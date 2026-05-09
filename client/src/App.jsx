import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import { useAuth } from './context/AuthContext';
import AuthForms from './components/Auth/AuthForms';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectList from './components/Dashboard/ProjectList';
import ProjectDetails from './components/Dashboard/ProjectDetails';
import CalendarView from './components/Dashboard/CalendarView';
import MyTasks from './components/Dashboard/MyTasks';
import Analytics from './components/Dashboard/Analytics';
import Settings from './components/Dashboard/Settings';
import Notes from './components/Dashboard/Notes';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import AnimatedCharacters from './components/Auth/AnimatedCharacters';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Let AuthContext handle loading initially
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AuthLayout = () => {
  const { user } = useAuth();
  const [passwordLength, setPasswordLength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="app-container" style={{ height: '100vh', overflow: 'hidden' }}>
      <nav className="navbar glass-panel">
        <div className="nav-brand">
          <h1>WorkFlowX</h1>
        </div>
        <ThemeToggle />
      </nav>

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        <div className="hero-section animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px', gap: '20px' }}>

          {/* Centered Text */}
          <div className="hero-text-centered" style={{ textAlign: 'center', width: '100%', maxWidth: '900px', marginTop: '10px', paddingBottom: '0' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-1px' }}>
              Streamline Your <span style={{ color: 'var(--primary-color)' }}>Workflow</span>
            </h2>
            <p className="subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The ultimate project management tool. Organize tasks, collaborate with your team, and deliver faster.
            </p>
          </div>

          {/* Side by side elements */}
          <div className="hero-content-row" style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'flex-start', gap: '60px' }}>
            <div className="desktop-only-characters" style={{ flex: 1, display: 'flex', justifyContent: 'center', marginTop: '0' }}>
              <AnimatedCharacters passwordLength={passwordLength} showPassword={showPassword} isTyping={isTyping} />
            </div>

            <div className="auth-wrapper" style={{ flex: 1, maxWidth: '440px', width: '100%' }}>
              <div className="auth-card glass-panel">
                <div className="auth-header" style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>Get Started</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter your credentials to continue.</p>
                </div>

                <AuthForms onPasswordChange={setPasswordLength} onShowPasswordChange={setShowPassword} onTyping={setIsTyping} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { borderRadius: '10px', background: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.9rem' },
        success: { iconTheme: { primary: 'var(--success-text)', secondary: '#fff' } },
        error: { iconTheme: { primary: 'var(--danger-text)', secondary: '#fff' } },
      }} />
      <Router>
        <Routes>
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route element={<Dashboard />}>
                    <Route index element={<ProjectList />} />
                    <Route path="project/:id" element={<ProjectDetails />} />
                    <Route path="calendar" element={<CalendarView />} />
                    <Route path="my-tasks" element={<MyTasks />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
