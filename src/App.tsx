import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '48px 40px',
    textAlign: 'center',
    maxWidth: '420px',
    border: '1px solid #334155',
  },
  title: {
    color: '#f1f5f9',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: '0 0 24px 0',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#166534',
    color: '#bbf7d0',
    borderRadius: '999px',
    padding: '6px 16px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  message: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 32px 0',
  },
  footer: {
    color: '#475569',
    fontSize: '12px',
    margin: '0',
  },
};

function App(): React.JSX.Element {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Campus Marketplace</h1>
        <p style={styles.subtitle}>Web Application</p>
        <div style={styles.badge}>🚀 Deployment Active</div>
        <p style={styles.message}>
          This is a pre-production deployment.<br />
          The full application is currently under development.
        </p>
        <p style={styles.footer}>OJT Semester 3 — Product Development</p>
      </div>
    </div>
  );
}

export default App;
