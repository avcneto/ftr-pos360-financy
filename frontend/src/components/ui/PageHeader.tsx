type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div>
      <span className="sr-only">{eyebrow}</span>
      <h1 className="m-0 text-2xl font-semibold text-[#111827]">{title}</h1>
      <p className="mt-1 text-sm text-[#4b5563]">{description}</p>
    </div>
  );
}
