import React from 'react';
import Sidebar from '../components/Sidebar';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary pt-20 lg:pt-24 pb-20 lg:pb-8">
      <Sidebar />
      <main className="lg:pl-60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Profile</h1>
          <p className="text-text-secondary">Manage your account and view your achievements.</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
