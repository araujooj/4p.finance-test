import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap hover:cursor-pointer rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-neutral-50 hover:bg-primary/90 border border-neutral-800",
        brand:
          "bg-brand-100 border border-brand-200 hover:bg-brand-50 text-neutral-900",
        outline:
          "bg-neutral-900 text-neutral-50 hover:bg-primary/90 border border-neutral-800",
        "icon-destructive":
          "rounded-md bg-alert-100 text-destructive border border-alert-100 size-8 hover:bg-destructive hover:text-foreground hover:border-destructive",
        icon: "rounded-md bg-neutral-900 border border-neutral-800 size-8",
        "transaction-type": "text-neutral-50 rounded-full h-8 px-4 py-2",
      },
      size: {
        default: "h-8 px-4 px-3.5 py-2",
      },
      state: {
        active: "bg-brand-300 text-brand-100 border border-brand-200",
        inactive: "",
      },
    },
    compoundVariants: [
      {
        variant: "transaction-type",
        state: "active",
        className:
          "bg-neutral-600 text-neutral-50 border border-neutral-600 text-sm py-1 px-3",
      },
      {
        variant: "transaction-type",
        state: "inactive",
        className:
          "bg-neutral-800 text-neutral-50 border border-neutral-800 hover:bg-neutral-700 text-sm py-1 px-3",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "inactive",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  state,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, state, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
