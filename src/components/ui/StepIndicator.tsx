type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300
                  ${
                    done
                      ? "bg-success text-white"
                      : active
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : "bg-light-gray text-muted border border-border"
                  }
                `}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  active ? "text-primary" : done ? "text-success" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 mb-4 transition-all duration-300
                  ${done ? "bg-success" : "bg-border"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
