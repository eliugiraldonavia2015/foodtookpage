import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showStrengthMeter?: boolean;
  error?: string;
  success?: boolean;
  successMessage?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = '••••••••',
  label = 'Contraseña',
  showStrengthMeter = false,
  error,
  success,
  successMessage
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    number: false,
    symbol: false
  });

  useEffect(() => {
    if (!showStrengthMeter) return;

    const hasLength = value.length >= 6;
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    setRequirements({
      length: hasLength,
      number: hasNumber,
      symbol: hasSymbol
    });

    let score = 0;
    if (hasLength) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
    setStrength(score);
  }, [value, showStrengthMeter]);

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-slate-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength === 1) return 'Débil';
    if (strength === 2) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-bold text-slate-700 block">{label}</label>}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 focus:ring-red-200' : success ? 'border-green-500 focus:ring-green-200' : 'border-slate-200 focus:ring-slate-200'} focus:border-slate-400 outline-none transition-all pr-20`}
          placeholder={placeholder}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {success && <Check size={18} className="text-green-500" />}
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
      </div>
      
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {!error && success && successMessage && <p className="text-xs text-green-500 font-medium">{successMessage}</p>}

      {showStrengthMeter && value.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 h-1.5 flex-1 max-w-[120px]">
              <div className={`h-full rounded-full flex-1 transition-all duration-300 ${strength >= 1 ? getStrengthColor() : 'bg-slate-200'}`} />
              <div className={`h-full rounded-full flex-1 transition-all duration-300 ${strength >= 2 ? getStrengthColor() : 'bg-slate-200'}`} />
              <div className={`h-full rounded-full flex-1 transition-all duration-300 ${strength >= 3 ? getStrengthColor() : 'bg-slate-200'}`} />
            </div>
            <span className="text-xs font-medium text-slate-500">{getStrengthText()}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className={`flex items-center gap-1.5 text-xs ${requirements.length ? 'text-green-600' : 'text-slate-400'}`}>
              {requirements.length ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
              <span>6+ caracteres</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs ${requirements.number ? 'text-green-600' : 'text-slate-400'}`}>
              {requirements.number ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
              <span>Al menos un número</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs ${requirements.symbol ? 'text-green-600' : 'text-slate-400'}`}>
              {requirements.symbol ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-slate-300" />}
              <span>Símbolo especial (*&^)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
