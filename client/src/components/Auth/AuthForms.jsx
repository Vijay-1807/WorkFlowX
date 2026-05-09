import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth, api } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AuthForms.css';

const AuthForms = ({ onPasswordChange, onShowPasswordChange, onTyping }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    // Clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
    if (e.target.name === 'password' && onPasswordChange) {
      onPasswordChange(e.target.value.length);
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!isLogin && formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.email = 'Enter a valid email address';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShowPasswordToggle = () => {
    const newVal = !showPassword;
    setShowPassword(newVal);
    if (onShowPasswordChange) onShowPasswordChange(newVal);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    if (!validateFields()) return;
    
    setIsLoading(true);
    setSuccess(false);

    try {
      if (!isLogin) {
        if (formData.name.trim().length < 2) {
          setError('Name must be at least 2 characters');
          toast.error('Name must be at least 2 characters');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          toast.error('Password must be at least 8 characters');
          setIsLoading(false);
          return;
        }
      }

      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess(true);
        toast.success('Login successful!');
      } else {
        await register(formData.name, formData.email, formData.password);
        setSuccess(true);
        toast.success('Account created! Please sign in.');
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(false);
          setIsLoading(false);
          setFormData({ name: '', email: formData.email, password: '' });
        }, 1500);
      }
    } catch (err) {
      setError(err);
      toast.error(err || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-tabs">
        <button 
          type="button"
          className={`auth-tab ${isLogin ? 'active' : ''}`} 
          onClick={() => { setIsLogin(true); setError(''); setSuccess(false); }}
        >
          Sign In
        </button>
        <button 
          type="button"
          className={`auth-tab ${!isLogin ? 'active' : ''}`} 
          onClick={() => { setIsLogin(false); setError(''); setSuccess(false); }}
        >
          Register
        </button>
        <div className={`tab-indicator ${isLogin ? 'left' : 'right'}`}></div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form animate-fade-in" key={isLogin ? 'login' : 'register'}>
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className={`input-group ${fieldErrors.name ? 'input-error' : ''}`}>
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
              {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
            </div>
          )}
          
          <div className={`input-group ${fieldErrors.email ? 'input-error' : ''}`}>
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
          </div>

          <div className={`input-group ${fieldErrors.password ? 'input-error' : ''}`}>
            <Lock className="input-icon" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              onFocus={() => onTyping && onTyping(true)}
              onBlur={() => onTyping && onTyping(false)}
              required 
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={handleShowPasswordToggle}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {fieldErrors.password && <span className="field-error-text">{fieldErrors.password}</span>}
          </div>
          {!isLogin && (
            <p className="input-hint">Password must be at least 8 characters</p>
          )}

          {isLogin && <button type="button" onClick={() => navigate('/forgot-password')} className="forgot-password" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--primary-color)' }}>Forgot password?</button>}

          <button 
            type="submit" 
            className={`primary-btn submit-btn ${success ? 'success' : ''}`} 
            disabled={isLoading || success}
          >
            {isLoading ? 'Processing...' : success ? (
              <>
                <CheckCircle size={18} />
                {isLogin ? 'Login Successful' : 'Account Created'}
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
    </div>
  );
};

export default AuthForms;
