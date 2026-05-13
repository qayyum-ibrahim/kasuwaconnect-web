import { useRef, type KeyboardEvent, type ClipboardEvent } from "react";

type PinInputProps = {
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  error?: string;
  label?: string;
};

export default function PinInput({
  value,
  onChange,
  onComplete,
  error,
  label,
}: PinInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").concat(["", "", "", ""]).slice(0, 4);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;
    const newDigits = [...digits];
    newDigits[index] = digit.slice(-1);
    const newVal = newDigits.join("");
    onChange(newVal);

    if (digit && index < 3) {
      inputs.current[index + 1]?.focus();
    }
    if (newVal.length === 4) {
      onComplete?.(newVal);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      onChange(newDigits.join(""));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    onChange(pasted);
    if (pasted.length === 4) {
      inputs.current[3]?.focus();
      onComplete?.(pasted);
    } else {
      inputs.current[pasted.length]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium text-text-sub uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`
              w-14 h-14 text-center text-xl font-bold border-2 rounded-card
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all duration-200 bg-white
              ${digit ? "border-primary text-dark" : "border-border text-muted"}
              ${error ? "border-error" : ""}
            `}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
    </div>
  );
}