import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-right"
      style={
        {
          "--normal-bg": "var(--neutral-900)",
          "--normal-text": "var(--white)",
          "--normal-border": "var(--neutral-800)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
