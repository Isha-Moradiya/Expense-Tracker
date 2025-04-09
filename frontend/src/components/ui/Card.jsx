export function Card({ children, className = "" }) {
  return (
    <div
      className={`w-full max-w-full p-4 sm:p-6 rounded-xl border shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-base sm:text-lg md:text-xl font-semibold ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-2 sm:p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`pt-4 border-t mt-4 ${className}`}>{children}</div>;
}
