import React from "react";
interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  error?: string;
  children?: React.ReactNode;
}

const TextBox = React.forwardRef<HTMLInputElement, IProps>(
  ({ className, children, labelText, type = "text", error, ...props }, ref) => {
    return (
      <div className={className + " relative"}>
        {labelText && (
          <label
            className="mb-2 block text-xs font-semibold text-[var(--color-muted)] lg:text-sm xl:text-base"
            htmlFor="txt"
          >
            {labelText}
          </label>
        )}
        <div className="flex items-stretch">
          <input
            id="txt"
            autoComplete="off"
            className={`w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-3 py-2 text-xs text-[var(--color-fg)] outline-none transition-all focus:ring-2 focus:ring-[var(--color-ring)] lg:text-sm xl:text-base
              ${error && "border-red-500 animate-shake"} ${
                children ? "rounded-r-none" : "rounded-2xl"
              }`}
            {...props}
            ref={ref}
            type={type}
          ></input>

          <div className="flex">{children}</div>
        </div>
        {error && (
          <p className="text-red-600 text-right animate-shake text-xs">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextBox.displayName = "TextBox";
export default TextBox;
