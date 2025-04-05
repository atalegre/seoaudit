
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import SubmissionForm from './SubmissionForm';
import SuccessView from './SuccessView';
import { ReportFormProps } from './types';

const ReportForm: React.FC<ReportFormProps> = ({ 
  url, 
  seoScore, 
  aioScore, 
  compact = false 
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sendByEmail, setSendByEmail] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  
  return (
    <div className="w-full animate-scale-in">
      {isSubmitted ? (
        <SuccessView 
          sendByEmail={sendByEmail} 
          compact={compact} 
          onDashboardClick={() => navigate(`/dashboard/client?url=${encodeURIComponent(url)}`)} 
        />
      ) : (
        <SubmissionForm
          url={url}
          seoScore={seoScore}
          aioScore={aioScore}
          compact={compact}
          sendByEmail={sendByEmail}
          setSendByEmail={setSendByEmail}
          setIsSubmitted={setIsSubmitted}
          user={user}
        />
      )}
    </div>
  );
};

export default ReportForm;
