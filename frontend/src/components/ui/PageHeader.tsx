type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div>
      <p className="m-0 text-[11px] uppercase tracking-[0.1em] text-[#9ca3af]">
        {eyebrow}
      </p>
      <h1 className="m-0 text-[#111827]">{title}</h1>
      <p className="mt-1.5 text-sm text-[#6b7280]">{description}</p>
    </div>
  );
}
