import { ReactNode } from "react";

export type TabProps = {
  className?: string;
  tabId: string;
  title: string;
  isSelected?: boolean;
  children?: ReactNode;
};

export function Tab({ className, isSelected, children }: TabProps) {
  return (
    <div className={className} role="tabpanel" aria-selected={isSelected}>
      {children}
    </div>
  )
}