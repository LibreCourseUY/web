import { cn } from '@/lib/utils';

type ItemList = {
  children?: React.ReactNode;
  className?: string;
};

interface ListProps {
  children?: React.ReactNode;
  className?: string;
}

function List({ children, className }: ListProps) {
  return <ul className={cn('text-2xl space-y-4', className)}>{children}</ul>;
}

List.Li = ({ children, className, ...props }: ItemList) => {
  return (
    <li className={cn('', className)} {...props}>
      {children}
    </li>
  );
};
export default List;