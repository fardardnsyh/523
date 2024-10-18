"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const chipVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-3xl border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        selected:
          "rounded-3xl border border-primary bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  asChild?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, size, asChild = false, ...props }, ref) => {
    const [variant, setVariant] = React.useState<"default" | "selected">(
      "default",
    );

    const toggleSelected = () => {
      if (variant === "default") setVariant("selected");
      else setVariant("default");
    };

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(chipVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={(event) => {
          toggleSelected();
          if (props.onClick) props.onClick(event);
        }}
      />
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
