
import React from 'react';
import { Link } from 'react-router-dom';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const NavLink = ({ to, children, onClick, className }: NavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={className || navigationMenuTriggerStyle()}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
