
import React from 'react';
import WebsiteForm from './forms/WebsiteForm';

interface AddWebsiteFormProps {
  onSuccess?: () => void;
  userId?: string;
}

const AddWebsiteForm = ({ onSuccess, userId }: AddWebsiteFormProps) => {
  return <WebsiteForm onSuccess={onSuccess} userId={userId} />;
};

export default AddWebsiteForm;
