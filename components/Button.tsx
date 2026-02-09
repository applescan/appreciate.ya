export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "danger"
    | "success"
    | "warning"
    | "outline-danger"
    | "outline-warning"
    | "outline-success"
    | "outline-primary";
  square?: boolean;
  paddingLess?: boolean;
}
const Button = ({
  className,
  children,
  variant,
  square,
  paddingLess,
  type = "button",
  ...props
}: IButtonProps) => {
  const getVariant = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl";
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "success":
        return "bg-emerald-500 hover:bg-emerald-600 text-white";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      case "outline-danger":
        return "bg-white/90 text-red-600 border border-red-200 hover:text-white hover:bg-red-600";
      case "outline-success":
        return "bg-white/90 text-emerald-600 border border-emerald-200 hover:text-white hover:bg-emerald-600";
      case "outline-warning":
        return "bg-white/90 text-amber-600 border border-amber-200 hover:text-white hover:bg-amber-500";
      case "outline-primary":
        return "bg-white/90 text-[var(--color-fg)] border border-[var(--color-border)] hover:text-[var(--color-fg)] hover:bg-white";

      default:
        return "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl";
    }
  };
  return (
    <button
      {...props}
      type={type}
      className={`
 
        ${getVariant()} transition-all duration-300 ${
          !paddingLess && "py-2 px-4"
        } ${!square && "rounded-full"} active:scale-95 ${className} `}
    >
      {children}
    </button>
  );
};

export default Button;
