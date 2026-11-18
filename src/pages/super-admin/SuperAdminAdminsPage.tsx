// ============================================================
// LAVSA — Super Admin Admins Page
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { Card, PageHeader } from '../../components/UI/ui';

const SuperAdminAdminsPage: React.FC = () => (
  <AppLayout>
    <div className="page super-admin-admins" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <PageHeader
        title="Admin Management"
        subtitle="Grant or revoke administrative privileges across campus units"
        icon="users"
      />
      <Card padded>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
          Administrative access control and delegation. Use the User Management tab to assign Admin roles to campus representatives.
        </p>
      </Card>
    </div>
  </AppLayout>
);

export default SuperAdminAdminsPage;
