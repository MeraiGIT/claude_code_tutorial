'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative"
    >
      <div className="glass-pearl-dark rounded-2xl p-4 transition-all duration-300 hover:shadow-pearl-lg hover:scale-[1.02]">
        <div className="flex items-center gap-4">
          {/* Custom Checkbox */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo.id)}
            className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
              todo.completed
                ? 'bg-atlantis-aqua border-atlantis-aqua shadow-glow'
                : 'border-atlantis-aqua hover:border-atlantis-light'
            }`}
          >
            {todo.completed && (
              <motion.svg
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-full h-full text-atlantis-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            )}
          </motion.button>

          {/* Todo Text */}
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEdit}
              autoFocus
              className="flex-1 bg-atlantis-dark/50 text-atlantis-pearl px-3 py-2 rounded-lg border border-atlantis-aqua/30 focus:outline-none focus:border-atlantis-aqua focus:ring-2 focus:ring-atlantis-aqua/20"
            />
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className={`flex-1 text-lg cursor-pointer transition-all duration-300 ${
                todo.completed
                  ? 'text-atlantis-teal line-through opacity-60'
                  : 'text-atlantis-pearl'
              }`}
            >
              {todo.text}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-atlantis-teal/30 hover:bg-atlantis-teal/50 transition-colors"
              title={isEditing ? 'Save' : 'Edit'}
            >
              {isEditing ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(todo.id)}
              className="p-2 rounded-lg bg-red-500/30 hover:bg-red-500/50 transition-colors"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
