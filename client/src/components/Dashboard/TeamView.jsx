import React, { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';
import { KanbanSkeleton } from '../Skeleton';

const TeamView = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/users');
        setTeam(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (isLoading) return <div style={{ padding: '24px' }}><KanbanSkeleton /></div>;

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Team Directory</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View all registered members in WorkFlowX.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {team.map(member => (
          <div key={member.id} className="glass-panel" style={{ padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{member.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                <Mail size={12} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</span>
              </div>
            </div>
            {member.role === 'ADMIN' && (
              <div style={{ color: 'var(--danger-text)', backgroundColor: 'var(--danger-bg)', padding: '6px', borderRadius: '8px', flexShrink: 0 }} title="Administrator">
                <Shield size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
