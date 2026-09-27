import type { HTMLAttributes, ReactNode } from "react";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const BASE_CLASS =
  "rounded-[12px] border border-[#e5e7eb] bg-white";

export function Surface({ className = "", children, ...props }: SurfaceProps) {
  return (
    <div className={`${BASE_CLASS} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
