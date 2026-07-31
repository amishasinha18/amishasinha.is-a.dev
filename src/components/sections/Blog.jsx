import { motion } from 'framer-motion';
import { Calendar, ExternalLink, FileText, PenLine } from 'lucide-react';
import Section from '../ui/Section.jsx';
import { useContent } from '../../content/ContentContext.jsx';

// Shown until data/blogs.js has entries. Kept deliberately warm rather than
// looking like a broken page.
function EmptyState() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="group relative">
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-sky-500/5 to-transparent opacity-70 blur-2xl" />
        <div className="relative rounded-xl bg-gradient-to-br from-primary/25 via-accent/15 to-transparent p-px shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)]">
          <div className="rounded-[11px] bg-[#FCFCFC] px-8 py-14 text-center shadow-inner ring-1 ring-black/5 dark:bg-surface dark:ring-white/10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
              <PenLine size={26} />
            </span>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
              Articles in the works
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
              I&apos;m currently writing up a few pieces on cloud, DevOps and the
              things I learn along the way. Check back soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
      className="group/post relative flex h-full flex-col"
    >
      {/* Ambient glow — blooms on hover so a grid of posts stays calm at rest */}
      <div className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover/post:opacity-100" />

      <div className="relative flex flex-1 flex-col rounded-2xl bg-gradient-to-br from-border via-border to-border/40 p-px shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out group-hover/post:-translate-y-1.5 group-hover/post:from-primary/50 group-hover/post:via-accent/25 group-hover/post:to-primary/30 group-hover/post:shadow-[0_22px_48px_rgba(0,0,0,0.16)]">
        <div className="flex flex-1 flex-col rounded-[15px] bg-background p-6 ring-1 ring-black/5 dark:ring-white/10 sm:p-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-transform duration-500 ease-out group-hover/post:scale-105">
            <FileText size={20} />
          </span>

          <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
            {post.title}
          </h3>

          {(post.venue || post.date) && (
            <p className="mt-1.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13px] tracking-tight text-muted">
              {post.venue}
              {post.venue && post.date && <span className="text-primary/40">&bull;</span>}
              {post.date && (
                <>
                  <Calendar size={13} className="shrink-0" />
                  <span>{post.date}</span>
                </>
              )}
            </p>
          )}

          {post.description && (
            <p className="mt-4 flex-1 text-[15px] leading-[1.75] text-[#333333] dark:text-[#C9B8C4]">
              {post.description}
            </p>
          )}

          {post.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/20 hover:shadow-md hover:shadow-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.link && (
            <div className="mt-6 border-t border-border pt-5">
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm font-semibold text-primary shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary hover:text-primary-fg hover:shadow-lg hover:shadow-primary/30"
              >
                <ExternalLink size={15} />
                Read article
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const { blogs, siteText } = useContent();
  const t = siteText.sections.blog;
  return (
    <Section
      id="blog"
      eyebrow={t.eyebrow}
      title={t.title}
      subtitle={t.subtitle}
    >
      {blogs.length > 0 ? (
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          {blogs.map((post, i) => (
            <PostCard key={post.link || post.title || i} post={post} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </Section>
  );
}
