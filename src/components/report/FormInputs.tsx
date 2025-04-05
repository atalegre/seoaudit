
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormInputsProps } from './types';

const FormInputs: React.FC<FormInputsProps> = ({ 
  name, 
  setName, 
  email, 
  setEmail, 
  phone, 
  setPhone, 
  compact 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          placeholder="Insira o seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={compact ? "h-8 text-sm" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@exemplo.pt"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={compact ? "h-8 text-sm" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="912 345 678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={compact ? "h-8 text-sm" : ""}
        />
      </div>
    </>
  );
};

export default FormInputs;
