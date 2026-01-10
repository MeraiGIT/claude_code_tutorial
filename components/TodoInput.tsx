'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="glass-pearl rounded-2xl p-6 shadow-pearl-lg"
    >
      <div className="flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new quest to your underwater kingdom..."
          autoFocus
          className="flex-1 bg-atlantis-dark/60 text-atlantis-pearl placeholder-atlantis-pearl/50 px-6 py-4 rounded-xl border border-atlantis-aqua/30 focus:outline-none focus:border-atlantis-aqua focus:ring-2 focus:ring-atlantis-aqua/30 transition-all text-lg font-body"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-atlantis-aqua to-atlantis-teal rounded-xl font-semibold text-white shadow-glow hover:shadow-pearl-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add</span>
        </motion.button>
      </div>
    </motion.form>
  );
}
