import { useRef, useEffect, useLayoutEffect } from "react";

export default function FormattedTextarea({ placeholder, value, onChange, required, rows = 3 }) {
  const ref = useRef(null);
  const nextCursor = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  useLayoutEffect(() => {
    if (nextCursor.current !== null && ref.current) {
      ref.current.selectionStart = ref.current.selectionEnd = nextCursor.current;
      nextCursor.current = null;
    }
  });

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const next = value.slice(0, s) + "  " + value.slice(end);
      nextCursor.current = s + 2;
      onChange({ target: { value: next } });
    }
  }

  function insertWrap(before, after) {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const selected = value.slice(s, e);
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    nextCursor.current = s + before.length + selected.length + after.length;
    onChange({ target: { value: next } });
    el.focus();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-500">Insert:</span>
        <button
          type="button"
          onClick={() => insertWrap("**", "**")}
          title="Wrap selection in bold"
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => insertWrap("==", "==")}
          title="Wrap selection in a highlight"
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          <span className="rounded px-1 bg-amber-400/30 text-amber-200">Highlight</span>
        </button>
        <button
          type="button"
          onClick={() => insertWrap("`", "`")}
          title="Wrap selection in inline code"
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition font-mono"
        >
          `inline`
        </button>
        <button
          type="button"
          onClick={() => insertWrap("```\n", "\n```")}
          title="Wrap selection in a code block"
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition font-mono"
        >
          ```block```
        </button>
        <span className="text-xs text-zinc-600 ml-auto">Tab = 2 spaces</span>
      </div>
      <textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        onKeyDown={handleKeyDown}
        className="w-full rounded-2xl border border-zinc-600 bg-zinc-800 px-5 py-3.5 text-white placeholder-zinc-500 outline-none focus:border-zinc-400 resize-none font-mono text-sm leading-relaxed"
        style={{ minHeight: `${rows * 1.75}rem` }}
      />
    </div>
  );
}
