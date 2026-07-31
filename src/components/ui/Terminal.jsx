import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useContent } from '../../content/ContentContext.jsx';

// Ubuntu/Linux-style terminal card — the authentic developer-terminal
// aesthetic. Command text is near-white, output is soft grey. Commands are
// typed character-by-character; their output then streams in quickly, the way
// a real shell prints it after you press Enter. The script (terminalCommands)
// is editable content, so segments/model are derived per-render via useMemo.

// Flatten the script into an ordered list of typed segments + a per-command
// ordinal model. Recomputed when the (editable) commands change.
function buildTerminal(commands) {
  const segments = [];
  (commands ?? []).forEach((c, block) => {
    segments.push({ kind: 'command', block, text: c.command });
    (c.output ?? []).forEach((line, oi) =>
      segments.push({
        kind: 'output',
        block,
        text: line,
        lastInBlock: oi === c.output.length - 1,
      })
    );
  });
  let ord = 0;
  const model = (commands ?? []).map((c) => {
    const cmdOrd = ord++;
    const outs = (c.output ?? []).map((line) => ({ line, ord: ord++ }));
    return { command: c.command, cmdOrd, outs };
  });
  return { segments, model, TOTAL: segments.length };
}

// Typing cadence (ms). Commands are keyed by a human; output prints fast.
const CMD_CHAR = 60;
const CMD_JITTER = 45;
const OUT_CHAR = 14;
const AFTER_CMD = 280; // pause after a command, like pressing Enter
const AFTER_OUT = 70;
const AFTER_BLOCK = 520; // longer beat between command blocks
const START_DELAY = 500; // let the card's entrance settle first

function Prompt({ host }) {
  return (
    <>
      <span className="text-[#C08BD6]">{host}</span>
      <span className="text-[#A96FBF]">:~</span>
      <span className="text-[#8A6E96]">$</span>{' '}
    </>
  );
}

function Cursor() {
  return (
    <span className="ml-0.5 inline-block h-4 w-2 translate-y-[2px] animate-blink bg-[#C08BD6] align-middle" />
  );
}

export default function Terminal() {
  const reduced = useReducedMotion();
  const { terminalCommands, siteText } = useContent();
  const host = siteText.terminal.host;
  const { segments, model, TOTAL } = useMemo(
    () => buildTerminal(terminalCommands),
    [terminalCommands]
  );

  // segIndex = segment currently typing; typed = chars shown of it.
  // With reduced motion we jump straight to the finished state.
  const [segIndex, setSegIndex] = useState(reduced ? TOTAL : 0);
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(reduced);

  // Hold the animation until the card has settled in.
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setStarted(true), START_DELAY);
    return () => clearTimeout(t);
  }, [reduced]);

  // The type engine: advance `typed` through the active segment, then step to
  // the next. Re-runs on every `typed`/`segIndex` change via the deps.
  useEffect(() => {
    if (!started || segIndex >= TOTAL) return;
    const seg = segments[segIndex];

    if (typed < seg.text.length) {
      const isCmd = seg.kind === 'command';
      const delay = isCmd ? CMD_CHAR + Math.random() * CMD_JITTER : OUT_CHAR;
      const t = setTimeout(() => setTyped((n) => n + 1), delay);
      return () => clearTimeout(t);
    }

    // Segment finished — pause, then move to the next.
    const pause =
      seg.kind === 'command' ? AFTER_CMD : seg.lastInBlock ? AFTER_BLOCK : AFTER_OUT;
    const t = setTimeout(() => {
      setSegIndex((i) => i + 1);
      setTyped(0);
    }, pause);
    return () => clearTimeout(t);
  }, [started, segIndex, typed]);

  const done = segIndex >= TOTAL;

  // How a given segment ordinal renders right now.
  const shown = (o, text) => {
    if (o < segIndex) return text; // fully typed
    if (o === segIndex) return text.slice(0, typed); // mid-type
    return null; // not started
  };
  const isActive = (o) => o === segIndex && !done;

  const lastBlock = model.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-xl"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#300A24] shadow-2xl ring-1 ring-black/20">
        {/* Title bar — Ubuntu Aubergine */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#5E2750] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#E95420]" />
          <span className="h-3 w-3 rounded-full bg-[#C4A0BD]" />
          <span className="h-3 w-3 rounded-full bg-[#7A5E72]" />
          <span className="ml-3 select-none font-mono text-xs text-[#D8C6D3]">
            {host}: ~
          </span>
        </div>

        {/* Body — a fixed min-height so the hero layout doesn't jump as lines
            appear. */}
        <div className="min-h-[320px] space-y-3 px-5 py-5 text-left font-mono text-[13px] leading-relaxed sm:min-h-[340px] sm:text-sm">
          {model.map((blk, bi) => {
            const cmdText = shown(blk.cmdOrd, blk.command);
            if (cmdText === null) return null; // block not reached yet

            return (
              <div key={blk.command}>
                {/* Command line */}
                <div className="whitespace-nowrap">
                  <Prompt host={host} />
                  <span className="font-medium text-[#F5F3F4]">{cmdText}</span>
                  {isActive(blk.cmdOrd) && <Cursor />}
                </div>

                {/* Output lines */}
                {blk.outs.map((o, oi) => {
                  const line = shown(o.ord, o.line);
                  if (line === null) return null;

                  const isLastOfAll =
                    bi === lastBlock && oi === blk.outs.length - 1;

                  return (
                    <div key={o.ord} className="text-[#D8CED4]">
                      {line}
                      {(isActive(o.ord) || (done && isLastOfAll)) && <Cursor />}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
