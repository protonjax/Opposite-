import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, className }: Props) {
  const base = 'rounded-xl py-4 px-6 items-center justify-center flex-row';
  const variants = {
    primary:   'bg-green',
    secondary: 'bg-surface border border-border',
    ghost:     'bg-transparent',
    danger:    'bg-red',
  };
  const textVariants = {
    primary:   'text-bg font-bold text-base',
    secondary: 'text-white font-semibold text-base',
    ghost:     'text-green font-semibold text-base',
    danger:    'text-white font-bold text-base',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#0A0A0A' : '#39FF14'} />
      ) : (
        <Text className={textVariants[variant]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
