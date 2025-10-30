import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// Keep the original custom alert as a separate export
import { AlertProps } from "@/types/alert";
import { CircleAlert } from "lucide-react";

export function CustomAlert({ title, description, type }: AlertProps) {
  return (
    <div
      className={`w-96 h-24 ${getAlertColor(
        type
      )} flex justify-start items-center pl-5  ${
        description ? "rounded-[18px]" : "rounded-3xl"
      } `}
    >
      <div className="flex flex-row justify-start items-start gap-2">
        <span className={`${getAlertTextColor(type)} pt-1`}>
          {<CircleAlert />}
        </span>
        <div className="">
          <div
            className={`font-work-sans font-medium text-xl ${getAlertTextColor(
              type
            )} `}
          >
            {title}
          </div>
          <div
            className={`font-work-sans font-normal text-base ${getAlertTextColor(
              type
            )}`}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

function getAlertColor(type: string) {
  switch (type) {
    case "success":
      return "bg-success-100";
    case "error":
      return "bg-error-100";

    case "warning":
      return "bg-warning-100";

    case "default":
      return "bg-neutral-100";

    default:
      return "bg-neutral-100";
  }
}

function getAlertTextColor(type: string) {
  switch (type) {
    case "success":
      return "text-success-400";
    case "error":
      return "text-error-400";

    case "warning":
      return "text-warning-400";

    case "default":
      return "text-neutral-400";

    default:
      return "text-neutral-400";
  }
}

export { Alert, AlertTitle, AlertDescription };

// Default export for compatibility
export default Alert;
