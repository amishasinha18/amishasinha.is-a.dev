import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Mail, Send } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons.jsx';
import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import { useContent } from '../../content/ContentContext.jsx';

const empty = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { profile, siteText } = useContent();
  const t = siteText.sections.contact;
  const contactLinks = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    { label: 'GitHub', value: 'View profile', href: profile.socials.github, icon: Github },
    { label: 'LinkedIn', value: 'Connect', href: profile.socials.linkedin, icon: Linkedin },
  ];
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.subject.trim()) next.subject = 'Please enter a subject.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    return next;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // UI-only for now: wire up Formspree / Web3Forms / a backend here later.
    console.log('Contact form submitted:', form);
    setSent(true);
    setForm(empty);
    setTimeout(() => setSent(false), 4000);
  };

  const inputClass = (field) =>
    `field-input w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none ${
      errors[field] ? 'field-input-error' : 'border-border'
    }`;

  return (
    <Section
      id="contact"
      padY="pt-20 pb-28 sm:pt-28 sm:pb-40"
      title={t.title}
      subtitle={
        <>
          <span className="block text-lg font-semibold text-foreground">{t.lead}</span>
          <span className="mt-2 block">{t.body}</span>
        </>
      }
    >
      {/* Availability — shown right where visitors reach out. */}
      <div className="mb-10 mt-10 flex justify-center">
        <StatusBadge label={t.badge} />
      </div>

      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        {/* Contact form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className={inputClass('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Drop your email"
              className={inputClass('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What would you like to discuss?"
              className={inputClass('subject')}
            />
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
          </div>
          <div>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Share your thoughts, ideas, or simply say hello!"
              className={inputClass('message')}
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>
          <Button
            type="submit"
            variant="purple"
            className="w-full duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
          >
            <Send size={18} /> Send Message
          </Button>
          {sent && (
            <p className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle2 size={16} /> {t.successMsg}
            </p>
          )}
        </form>

        {/* Direct links */}
        <div className="space-y-4">
          {contactLinks.map(({ label, value, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-4 rounded-xl border border-border bg-surface/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/15"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-primary/20">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold tracking-tight text-foreground">
                  {label}
                </span>
                <span className="block truncate text-sm text-muted">{value}</span>
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-muted transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
