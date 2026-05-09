import React, { useEffect, useState } from 'react';
import { api } from '../../context/AuthContext';
import { Folder, CheckCircle, Clock, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalyticsSkeleton } from '../Skeleton';
import './Analytics.css';

const COLORS_STATUS = ['#3b82f6', '#f59e0b', '#10b981'];
const COLORS_PRIORITY = ['#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/users/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) return <div className="analytics-page"><div style={{ marginBottom: '8px' }}><h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Analytics</h2><p style={{ color: 'var(--text-secondary)' }}>Overview of your project and task performance</p></div><AnalyticsSkeleton /></div>;
  if (!data) return <p style={{ color: 'var(--danger-text)' }}>Failed to load analytics.</p>;

  const completionRate = data.totalTasks > 0
    ? Math.round((data.completedTasks / data.totalTasks) * 100)
    : 0;

  const stats = [
    { label: 'Total Projects', value: data.totalProjects, icon: <Folder size={24} />, color: 'var(--accent-color)', bg: 'rgba(37,99,235,0.1)' },
    { label: 'Total Tasks', value: data.totalTasks, icon: <Clock size={24} />, color: 'var(--warning-text)', bg: 'var(--warning-bg)' },
    { label: 'Completed Tasks', value: data.completedTasks, icon: <CheckCircle size={24} />, color: 'var(--success-text)', bg: 'var(--success-bg)' },
    { label: 'Due This Week', value: data.upcomingTasksCount, icon: <Calendar size={24} />, color: 'var(--accent-color)', bg: 'rgba(37,99,235,0.1)' },
    { label: 'Overdue Tasks', value: data.overdueTasksCount, icon: <AlertCircle size={24} />, color: 'var(--danger-text)', bg: 'var(--danger-bg)' },
  ];

  // Recharts data
  const taskStatusData = [
    { name: 'To Do', value: data.taskStatusCounts.TODO },
    { name: 'In Progress', value: data.taskStatusCounts.IN_PROGRESS },
    { name: 'Done', value: data.taskStatusCounts.DONE },
  ];

  const taskPriorityData = [
    { name: 'Low', value: data.taskPriorityCounts.LOW },
    { name: 'Medium', value: data.taskPriorityCounts.MEDIUM },
    { name: 'High', value: data.taskPriorityCounts.HIGH },
  ];

  const projectStatusData = [
    { name: 'Planned', count: data.projectStatusCounts.PLANNED },
    { name: 'Active', count: data.projectStatusCounts.ACTIVE },
    { name: 'Completed', count: data.projectStatusCounts.COMPLETED },
  ];

  const CustomTooltipStyle = {
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  return (
    <div className="analytics-page">
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>{data.isAdmin ? 'System Analytics' : 'Analytics'}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{data.isAdmin ? 'Global overview of system-wide performance' : 'Overview of your project and task performance'}</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card glass-panel">
            <div className="stat-icon" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <p className="stat-label">{s.label}</p>
              <h3 className="stat-value">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        {/* Completion Rate Ring */}
        <div className="chart-card glass-panel">
          <h4>Overall Task Completion</h4>
          <div className="completion-ring-wrapper">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="64" fill="none" stroke="var(--border-color)" strokeWidth="14" />
              <circle
                cx="80" cy="80" r="64" fill="none"
                stroke="var(--accent-color)" strokeWidth="14"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - completionRate / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="ring-center">
              <span className="ring-percent">{completionRate}%</span>
              <span className="ring-label">Done</span>
            </div>
          </div>
          <div className="completion-legend">
            <div className="legend-row"><span style={{ backgroundColor: 'var(--accent-color)' }}></span> Completed ({data.completedTasks})</div>
            <div className="legend-row"><span style={{ backgroundColor: 'var(--border-color)' }}></span> Remaining ({data.totalTasks - data.completedTasks})</div>
          </div>
        </div>

        {/* Recharts Pie Chart — Task Status */}
        <div className="chart-card glass-panel">
          <h4>Task Status Distribution</h4>
          <div style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Bar Chart — Priority */}
        <div className="chart-card glass-panel">
          <h4>Tasks by Priority</h4>
          <div style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskPriorityData} barSize={36}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} cursor={{ fill: 'rgba(37,99,235,0.05)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PRIORITY[index % COLORS_PRIORITY.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Bar Chart — Project Status */}
        <div className="chart-card glass-panel">
          <h4>Projects by Status</h4>
          <div style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData} barSize={36}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} cursor={{ fill: 'rgba(37,99,235,0.05)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
