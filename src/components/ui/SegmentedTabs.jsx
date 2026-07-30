import { motion } from 'framer-motion';

// Modern segmented control: all tabs grouped in one soft-tinted container with
// a sliding Ubuntu-purple active pill. Shared across About / Skills / Projects.
export default function SegmentedTabs({
  tabs,
  active,
  onChange,
  layoutId = 'segmentedTabHighlight',
  className = '',
}) {
  return (
    <div className={`mb-10 flex justify-center ${className}`}>
      <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-primary/5 p-1">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                isActive
                  ? 'text-primary-fg'
                  : 'text-muted hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-2">
                {Icon && (
                  <Icon size={16} className={isActive ? '' : 'text-primary'} />
                )}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
