import React from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  return (
    <div className="tabs">
      {children}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={`tabs-list ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  return (
    <button className="tabs-trigger">
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  return (
    <div className="tabs-content">
      {children}
    </div>
  );
};
