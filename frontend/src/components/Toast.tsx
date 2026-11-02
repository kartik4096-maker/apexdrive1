import { useEffect, useState, useCallback } from "react";
import { Icon } from "./Icons";

export function useToast() {
  const [msg, setMsg] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3800);
    return () => clearTimeout(t);
  }, [msg]);

  // Wrap in useCallback so this function doesn't change on every render
  const show = useCallback((text: string, error = false) => {
    setMsg({ text, error });
  }, []);

  return {
    show,
    node: (
      <div className={"toast" + (msg ? " show" : "") + (msg?.error ? " error" : "")} role="status" aria-live="polite">
        {msg && (<>
          <Icon name={msg.error ? "info" : "check"} />
          <span>{msg.text}</span>
        </>)}
      </div>
    ),
  };
}