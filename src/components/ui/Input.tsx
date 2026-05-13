type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  prefix?: string;
  className?: string;
};

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  disabled = false,
  prefix,
  className = "",
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-sm font-medium text-text-sub select-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
             w-full h-12 border rounded-card px-4 text-sm text-text-main
            bg-white placeholder:text-muted
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            disabled:bg-light-gray disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? "border-error focus:border-error focus:ring-error/20" : "border-border"}
            ${prefix ? "pl-14" : ""}
          `}
        />
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
