import { Loader2 } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}: ButtonProps) {
  const base =
    "h-12 px-6 rounded-btn font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "text-text-sub hover:text-text-main bg-transparent hover:bg-light-gray disabled:opacity-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}