'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTodos } from '@/hooks/useTodos';
import UnderwaterScene from '@/components/UnderwaterScene';
import Header from '@/components/Header';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import FilterButtons from '@/components/FilterButtons';

export default function Home() {
  const {
    todos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 3D Background Scene */}
      <UnderwaterScene />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <Header />

        {/* Todo Input */}
        <div className="mb-6">
          <TodoInput onAdd={addTodo} />
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <FilterButtons
            currentFilter={filter}
            onFilterChange={setFilter}
            stats={stats}
          />
        </div>

        {/* Stats Bar */}
        {stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-pearl-dark rounded-xl p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex gap-6 text-sm">
              <span className="text-atlantis-pearl">
                <span className="font-semibold text-atlantis-aqua">{stats.total}</span> total
              </span>
              <span className="text-atlantis-pearl">
                <span className="font-semibold text-atlantis-aqua">{stats.active}</span> active
              </span>
              <span className="text-atlantis-pearl">
                <span className="font-semibold text-atlantis-teal">{stats.completed}</span> completed
              </span>
            </div>

            {stats.completed > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearCompleted}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all text-sm font-medium"
              >
                Clear Completed
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Todo List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {todos.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="glass-pearl-dark rounded-2xl p-12 text-center"
              >
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <svg
                    className="w-24 h-24 mx-auto mb-4 text-atlantis-teal opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-semibold text-atlantis-pearl mb-2">
                  No Tasks Yet
                </h3>
                <p className="text-atlantis-teal">
                  {filter === 'active' && 'No active tasks. Time to add some!'}
                  {filter === 'completed' && 'No completed tasks yet. Keep going!'}
                  {filter === 'all' && 'Your Atlantis kingdom awaits. Add your first task above.'}
                </p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-atlantis-pearl/50 text-sm"
        >
          <p>Built with Next.js, React Three Fiber & Framer Motion</p>
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mt-2 text-atlantis-aqua/60"
          >
            ✨ Dive deep into productivity ✨
          </motion.div>
        </motion.footer>
      </div>

    </main>
  );
}
