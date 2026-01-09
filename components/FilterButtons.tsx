'use client';

import { motion } from 'framer-motion';
import { TodoFilter } from '@/types';

interface FilterButtonsProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

const filters: { label: string; value: TodoFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export default function FilterButtons({ currentFilter, onFilterChange, stats }: FilterButtonsProps) {
  const getCount = (filter: TodoFilter) => {
    switch (filter) {
      case 'all': return stats.total;
      case 'active': return stats.active;
      case 'completed': return stats.completed;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-pearl-dark rounded-2xl p-4 shadow-pearl"
    >
      <div className="flex gap-2">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.value;
          const count = getCount(filter.value);

          return (
            <motion.button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-atlantis-aqua to-atlantis-teal text-white shadow-glow'
                  : 'bg-atlantis-dark/30 text-atlantis-pearl hover:bg-atlantis-dark/50'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {filter.label}
                <span
                  className={`text-sm px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20'
                      : 'bg-atlantis-teal/30'
                  }`}
                >
                  {count}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-atlantis-aqua to-atlantis-teal rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
