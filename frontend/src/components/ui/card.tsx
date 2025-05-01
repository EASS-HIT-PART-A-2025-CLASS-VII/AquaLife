// Card component
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardHeader component
interface CardHeaderProps {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return (
    <div className="border-b pb-4">
      {children}
    </div>
  );
};

// CardContent component (allowing className)
interface CardContentProps {
  children: React.ReactNode;
  className?: string;  // Make sure className is optional
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

// CardFooter component (allowing className)
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;  // Make sure className is optional
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={`border-t pt-4 ${className}`}>
      {children}
    </div>
  );
};

// CardTitle component
interface CardTitleProps {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return (
    <h2 className="text-2xl font-bold text-gray-900">
      {children}
    </h2>
  );
};

// CardDescription component
interface CardDescriptionProps {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return (
    <p className="text-sm text-gray-600">
      {children}
    </p>
  );
};
