import { cn, formatLink } from "@/lib/utils";

interface TextProps {
	className?: string;
	children: React.ReactNode;
}

interface AnchorProps extends TextProps {
	link: string;
	openInTab?: boolean;
}

function TextH1({ children, className }: TextProps) {
	return <h1 className={cn("text-6xl text-start", className)}>{children}</h1>;
}

function TextH2({ children, className }: TextProps) {
	return <h2 className={cn("text-5xl wrap-break-word text-start", className)}>{children}</h2>;
}

function TextP({ children, className }: TextProps) {
	return <p className={cn("text-2xl text-start", className)}>{children}</p>;
}

function TextA({ link, openInTab = false, children, className }: AnchorProps) {
	return (
		<a
			className={cn("text-2xl text-start text-emphasis-secondary", className)}
			{...(openInTab ? { target: "_blank" } : {})}
			href={formatLink(link)}
		>
			{children}
		</a>
	);
}

export { TextH1, TextH2, TextP, TextA };

const Text = { H1: TextH1, H2: TextH2, P: TextP, A: TextA };
export default Text;