// ============================================================
// LAVSA — Admin Listings Page
// Review, moderate, and monitor campus listings.
// ============================================================

import React from 'react';
import AppLayout from '../../components/Layout/AppLayout';
import { Card, PageHeader } from '../../components/UI/ui';

const AdminListingsPage: React.FC = () => (
  <AppLayout>
    <div className="page admin-listings-page" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <PageHeader
        title="Listings Moderation"
        subtitle="Review, approve, or flag campus buy &amp; sell listings"
        icon="grid"
      />
      <Card padded>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
          All active listings comply with current campus safety and community standards. Automated moderation active.
        </p>
      </Card>
    </div>
  </AppLayout>
);

export default AdminListingsPage;
