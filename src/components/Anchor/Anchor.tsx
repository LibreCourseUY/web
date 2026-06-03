import styles from './styles.module.css';
import { cn } from '@/lib/utils';

interface AnchorProps {
  className?: string;
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function Anchor({ href, children, className, disabled }: AnchorProps) {
  return (
    <a
      href={!disabled ? href : undefined}
      target='_blank'
      className={cn(
				disabled && cn(styles.disabled),
        styles.anchor,
				"relative text-2xl text-emphasis-secondary",
        disabled ? "cursor-default text-emphasis-secondary/60" : "cursor-pointer hover:text-emphasis-secondary/80",
        className,
      )}
    >
      <button className={cn(
        'cursor-pointer disabled:cursor-default'
      )} disabled={disabled}>
      {children}
        </button>
    </a>
  );
}
