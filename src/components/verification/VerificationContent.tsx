
import React from 'react';
import VerificationStatus from './VerificationStatus';
import VerificationHeader from './VerificationHeader';
import VerificationInstructions from './VerificationInstructions';
import SpamInstructions from './SpamInstructions';
import ResendButton from './ResendButton';

interface VerificationContentProps {
  email: string;
  emailSent: boolean;
  isResending: boolean;
  handleResendVerification: () => void;
}

const VerificationContent = ({
  email,
  emailSent,
  isResending,
  handleResendVerification,
}: VerificationContentProps) => {
  return (
    <div className="space-y-6">
      <VerificationStatus emailSent={emailSent} />
      <VerificationHeader email={email} />
      <VerificationInstructions />
      <SpamInstructions />
      <ResendButton 
        onResend={handleResendVerification}
        isResending={isResending}
      />
    </div>
  );
};

export default VerificationContent;
