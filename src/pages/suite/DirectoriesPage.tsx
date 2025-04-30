
import React from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import DirectoryPresence from '@/components/suite/directories/DirectoryPresence';
import AuthRequiredRoute from '@/components/auth/AuthRequiredRoute';

const DirectoriesPage = () => {
  return (
    <SuiteLayout title="Presença em Diretórios">
      <AuthRequiredRoute>
        <DirectoryPresence />
      </AuthRequiredRoute>
    </SuiteLayout>
  );
};

export default DirectoriesPage;
