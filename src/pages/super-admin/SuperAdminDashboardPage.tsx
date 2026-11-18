// ============================================================
// LAVSA — Super Admin Dashboard
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { Card, PageHeader } from '../../components/UI/ui';

const SuperAdminDashboardPage: React.FC = () => (
  <AppLayout>
    <div className="page super-admin-dashboard" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <PageHeader
        title="Super Admin Control Panel"
        subtitle="System-level administration, security policies, and global configuration"
        icon="shield"
      />
      <Card padded>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
          Super Admin control console. Manage campus administrators, oversee platform escrow, and configure global marketplace policies.
        </p>
      </Card>
    </div>
  </AppLayout>
);

export default SuperAdminDashboardPage;
