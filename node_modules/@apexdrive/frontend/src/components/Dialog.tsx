import { ReactNode, useEffect, useRef } from "react";
import { Icon } from "./Icons";

interface Props {
  title: string;
  compact?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ title, compact, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!el.open) el.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <dialog
      ref={ref}
      className={compact ? "compact" : ""}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div id="modalContent">
        <div className="modal-top">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </dialog>
  );
}