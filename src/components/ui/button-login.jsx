import * as React from "react";

const Button = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center px-8 py-4 text-black bg-softPink border border-vibrantPink rounded-full transition-all duration-300 ease-in-out hover:bg-vibrantPink hover:text-softPink hover:border-lightPink disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
