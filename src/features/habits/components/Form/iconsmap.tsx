
import React, { useMemo } from 'react';
import habitIcons from './icons';
import { Smile } from 'lucide-react'; // Fallback icon

type HabitIconProps = {
  name: string;
  size?: number;
  className?: string;
};

const HabitIcon: React.FC<HabitIconProps> = ({
  name,
  size = 20,
  className = 'inline-block',
}) => {
  // Memoized icon map
  const iconMap = useMemo(
    () => Object.fromEntries(habitIcons.map(({ name, icon }) => [name, icon])),
    []
  );

  const Icon = iconMap[name] || Smile; // fallback to Smile icon

  return <Icon size={size} className={className} />;
};

export default HabitIcon;

