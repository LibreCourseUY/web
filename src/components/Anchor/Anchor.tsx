import styles from './styles.module.css';
import { cn } from '@/lib/utils';

interface AnchorProps {
  className?: string;
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function Anchor({ href, children, className, disabled }: AnchorProps) {
  if (disabled) {
    return (
      <span
        className={cn(
          styles.disabled,
          styles.anchor,
          "relative text-2xl text-emphasis-secondary/60 cursor-default",
          className,
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target='_blank'
      className={cn(
        styles.anchor,
        "relative text-2xl text-emphasis-secondary cursor-pointer hover:text-emphasis-secondary/80",
        className,
      )}
    >
      {children}
    </a>
  );
}
