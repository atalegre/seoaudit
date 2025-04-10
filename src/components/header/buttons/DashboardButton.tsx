
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const DashboardButton = () => {
  const navigate = useNavigate();
  const { user, role } = useUser();
  
  if (!user) return null;
  
  const handleClick = () => {
    if (role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/suite');
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleClick}
      className="flex items-center gap-2"
    >
      <LayoutDashboard className="h-4 w-4" />
      {role === 'admin' ? 'Admin' : 'Suite'}
    </Button>
  );
};

export default DashboardButton;
