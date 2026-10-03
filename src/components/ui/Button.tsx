import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "text" | "arrow" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  icon,
  ...props
}: ButtonProps) {
  // Base styles tailored to the premium architectural aesthetic
  const baseStyles = "inline-flex items-center justify-center font-display transition-all duration-300";
  
  const variants = {
    primary: "bg-solvorry-DEFAULT text-white px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded-[2px] hover:bg-solvorry-mid group",
    secondary: "bg-transparent border border-white/30 text-white px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded-[2px] hover:bg-solvorry-DEFAULT hover:border-solvorry-DEFAULT hover:text-white group",
    // NOTE: If secondary is used on a light background, we should pass a specific className override like `border-solvorry-DEFAULT text-solvorry-DEFAULT hover:text-white border-black/20 text-black` etc.
    text: "text-solvorry-DEFAULT text-sm font-semibold uppercase tracking-wider group hover:underline underline-offset-4",
    arrow: "text-white text-xs font-semibold uppercase tracking-widest group",
    icon: "w-11 h-11 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-solvorry-dark transition-colors rounded-[2px]"
  };

  const currentStyles = `${baseStyles} ${variants[variant]} ${className}`;

  const renderContent = () => {
    switch (variant) {
      case "primary":
      case "secondary":
        return (
          <>
            {children}
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </>
        );
      case "text":
        return (
          <>
            {children}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block" />
          </>
        );
      case "arrow":
        return (
          <span className="flex items-center gap-2">
            {children}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        );
      case "icon":
        return icon || children;
      default:
        return children;
    }
  };

  if (href) {
    return (
      <Link href={href} className={currentStyles}>
        {renderContent()}
      </Link>
    );
  }

  return (
    <button className={currentStyles} {...props}>
      {renderContent()}
    </button>
  );
}
