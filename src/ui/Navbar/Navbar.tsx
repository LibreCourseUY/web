import { cn } from '@/lib/utils';

interface NavBarProps {
  className?: string;
  pathname?: string;
}

export default function NavBar({ className, pathname }: NavBarProps) {
  const route = [
    { name: 'Home', href: '/' },
    { name: 'Learn', href: '/learn' },
    { name: 'Projects', href: '/projects' },
    { name: 'Docs', href: '/docs' },
    { name: 'Open source', href: '/open-source' },
    { name: 'CLA', href: '/cla' },
  ];
  return (
    <div className={cn(className, 'h-16 w-dvw bg-background/95 px-12 lg:px-24 sticky top-0 backdrop-blur-sm z-50')}>
      <div
        className={cn('h-16 w-full flex flex-row justify-between items-center')}
      >
        <span>
          <b>
            <a href="/">LibreCourseUY</a>
          </b>
        </span>

        <div className="flex flex-row items-center gap-4">
          <ul className="flex flex-row gap-4">
            {route.map((item, _, arr) => (
              <li key={item.name}>
                <a
                  className={cn(
                    'text-sm font-bold inline-block',
                    arr.at(-1)?.name === item.name ? "pr-0 boder-r-0" : "pr-3 border-r border-neutral-700",
                    pathname === item.href ? 'text-emphasis/60 font-normal' : 'text-text-emphasis hover:text-emphasis/80',
                  )}
                  href={item.href}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <button disabled id="theme-lang" className="bg-emphasis w-12 h-6 rounded-full cursor-pointer disabled:cursor-not-allowed">En</button>
        </div>
      </div>
    </div>
  );
}
