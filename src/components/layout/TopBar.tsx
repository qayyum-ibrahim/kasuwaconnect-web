type TopBarProps = {
  title:    string;
  subtitle?: string;
};

export default function TopBar({ title, subtitle }: TopBarProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
                "Good evening";

  return (
    <div className="bg-white border-b border-border px-8 py-5 flex items-center justify-between">
      <div>
        <p className="text-muted text-xs font-medium uppercase tracking-wide">
          {greeting}
        </p>
        <h1 className="text-xl font-bold text-dark mt-0.5">{title}</h1>
        {subtitle && (
          <p className="text-text-sub text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span className="text-xs text-text-sub font-medium">Live</span>
      </div>
    </div>
  );
}