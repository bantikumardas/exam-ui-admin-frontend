import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

export default function CompanyKeyCell({ companyKey }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(companyKey);
      } else {
        const ta = document.createElement("textarea");
        ta.value = companyKey;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied — nothing we can do, silently ignore
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm tracking-wider text-zinc-200">
        {visible ? companyKey : "•".repeat(Math.max(companyKey?.length || 4, 4))}
      </span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        title={visible ? "Hide key" : "Show key"}
        className="rounded-lg border border-zinc-700 p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy key"
        className="rounded-lg border border-zinc-700 p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
