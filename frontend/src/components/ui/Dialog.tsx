import { useEffect, useRef, type ReactNode } from "react";

type DialogProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function Dialog({ title, onClose, children, wide = false }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    return () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={`${wide ? "w-[min(100%-2rem,492px)]" : "w-[min(100%-2rem,448px)]"} max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border-0 bg-transparent p-0 shadow-2xl backdrop:bg-[#111827]/55`}
    >
      <div className="relative">
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-6 top-6 z-10 grid h-8 w-8 place-items-center rounded-lg border border-[#d1d5db] bg-white text-[#6b7280] hover:bg-[#f3f4f6]"
        >
          <img src="/Icon/x.svg" alt="" className="h-4 w-4" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
