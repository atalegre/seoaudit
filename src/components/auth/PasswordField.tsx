
import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface PasswordFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
}

const PasswordField = ({ form, name, label = "Password" }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Esconder password' : 'Mostrar password'}
                </span>
              </button>
              <Input
                type={showPassword ? 'text' : 'password'}
                className="pr-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
