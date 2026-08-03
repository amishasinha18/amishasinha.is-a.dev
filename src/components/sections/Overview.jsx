import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useContent } from '../../content/ContentContext.jsx';
import Button from '../ui/Button.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import Terminal from '../ui/Terminal.jsx';

export default function Overview({ onNavigate }) {
  const { profile, milestones, siteText } = useContent();
  const hero = siteText.hero;
  return (
    <section id="home" className="relative overflow-hidden py-12 sm:py-16">
      <div className="container relative z-10">
        {/* Hero: intro text + terminal card */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl"
            >
              {profile.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 text-xl font-medium text-primary sm:text-2xl"
            >
              {hero.role}
            </motion.p>

            {/* Live status badge — a real pulsing dot (not the 🟢 emoji) for a
                genuine "live" effect. */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-4 flex justify-center lg:justify-start"
            >
              <StatusBadge label={hero.statusBadge} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-3 max-w-xl text-base leading-relaxed text-muted mx-auto lg:mx-0 sm:text-lg"
            >
              {hero.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Button
                variant="purple"
                href="https://i.ibb.co/ns8CFMBv/CV-AMISHA.png"
                target="_blank"
                rel="noreferrer"
                download
                className="shadow-lg shadow-primary/30 duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/50"
              >
                <Download size={18} /> {hero.resumeLabel}
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate('contact')}
                className="duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
              >
                {hero.contactLabel}
              </Button>
            </motion.div>
          </div>

          {/* Terminal hero card */}
          <Terminal />
        </div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {milestones.map((m) => (
              <div key={m.sub} className="group relative">
                {/* Glow — hidden until hover, fades in over 500ms */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/40 via-sky-500/30 to-primary/40 opacity-0 blur-lg transition-opacity duration-500 ease-out group-hover:opacity-100" />

                <div className="relative rounded-xl border border-border bg-surface/80 p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-primary/40 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
                  <p className="text-2xl font-bold text-primary sm:text-3xl">{m.value}</p>
                  <p className="mt-2 text-sm text-muted sm:text-base">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
