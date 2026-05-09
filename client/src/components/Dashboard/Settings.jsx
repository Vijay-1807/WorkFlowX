import React, { useState } from 'react';
import { useAuth, api } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';
import { User, Bell, Lock, Monitor, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const handleProfileSave = async () => {
    try {
      await api.put('/users/me', profileForm);
      toast.success('Profile updated! Refresh to see changes globally.');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return toast.error('Please enter both current and new password');
    }
    if (passwordForm.newPassword.length < 8) {
      return toast.error('New password must be at least 8 characters');
    }
    try {
      await api.put('/users/me', passwordForm);
      toast.success('Password updated successfully!');
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    }
  };

  const handleToggle = () => toast.success('Preference saved!');

  return (
    <div className="settings-page">
      <div className="settings-header" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account preferences and application settings.</p>
      </div>

      <div className="settings-container">
        {/* Profile Card */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <User size={20} className="settings-icon" />
            <h3>Profile Information</h3>
          </div>
          <div className="settings-card-body">
            <div className="profile-info-row" style={{ alignItems: 'flex-start' }}>
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="profile-details" style={{ flex: 1 }}>
                {isEditingProfile ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
                    <input 
                      type="text" 
                      value={profileForm.name} 
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      className="form-input"
                      placeholder="Full Name"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />
                    <input 
                      type="email" 
                      value={profileForm.email} 
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                      className="form-input"
                      placeholder="Email Address"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                ) : (
                  <>
                    <h4>{user?.name}</h4>
                    <p>{user?.email}</p>
                    <span className="role-badge">{user?.role}</span>
                  </>
                )}
              </div>
            </div>
            {isEditingProfile ? (
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="primary-btn" onClick={handleProfileSave}>Save Changes</button>
                <button className="secondary-btn" onClick={() => { setIsEditingProfile(false); setProfileForm({ name: user?.name, email: user?.email }) }}>Cancel</button>
              </div>
            ) : (
              <button className="primary-btn outline-btn" style={{ marginTop: '20px' }} onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
            )}
          </div>
        </div>

        {/* Preferences Card */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Monitor size={20} className="settings-icon" />
            <h3>Appearance</h3>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <div>
                <h4>Theme Mode</h4>
                <p>Toggle between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Lock size={20} className="settings-icon" />
            <h3>Security</h3>
          </div>
          <div className="settings-card-body">
            <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div>
                  <h4>Change Password</h4>
                  <p>Ensure your account is using a long, random password</p>
                </div>
                {!isChangingPassword && (
                  <button className="secondary-btn" onClick={() => setIsChangingPassword(true)}>Update Password</button>
                )}
              </div>
              
              {isChangingPassword && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '300px', marginTop: '8px' }}>
                  <input 
                    type="password" 
                    placeholder="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                  <input 
                    type="password" 
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.9rem' }} onClick={handlePasswordSave}>Save</button>
                    <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.9rem' }} onClick={() => { setIsChangingPassword(false); setPasswordForm({ currentPassword: '', newPassword: '' }) }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
            <div className="setting-row">
              <div>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <button className="secondary-btn" onClick={() => toast.success('2FA feature is coming soon!')}>Enable 2FA</button>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Bell size={20} className="settings-icon" />
            <h3>Notifications</h3>
          </div>
          <div className="settings-card-body">
            <div className="setting-row">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive email updates about your tasks</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked onChange={handleToggle} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-row">
              <div>
                <h4>Push Notifications</h4>
                <p>Get alerted on your device</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked onChange={handleToggle} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
