import { cn, formatLink } from "@/lib/utils";

function Text() {
	return null;
}

interface TextProps {
	className?: string,
	children: React.ReactNode,
}

Text.H1 = ({ children, className }: TextProps) => {

	return <h1 className={cn("text-6xl text-start", className)}>{children}</h1>
}

Text.H2 = ({ children, className }: TextProps) => {

	return <h2 className={cn("text-6xl wrap-break-word text-start", className)}>{children}</h2>
}

Text.P = ({ children, className }: TextProps) => {

	return <p className={cn("text-2xl text-start", className)}>{children}</p>
}

Text.A = ({ link, openInTab = false, children, className }: TextProps & { link: string, openInTab?: boolean }) => {

	return <a
		className={cn("text-2xl text-start text-emphasis-secondary", className)}
		{... !openInTab ? { target: "_blank" } : {}}
		href={formatLink(link)}>{children}
	</a>
}

export default Text