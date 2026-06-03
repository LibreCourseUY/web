import Text from '@/components/Text/Text';
import { cn, formatLink, twstr } from '@/lib/utils';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

type ProjectType = {
	title: string;
	description: string;
	autor: {
		name: string;
		link: string;
	};
	image?: string | null;
	stack: string[];
	pj_link: string;
};

type GenericProps = {
	className?: string;
	children?: React.ReactNode;
	index?: number;
};

type CardsProps = ProjectType & GenericProps;

function Cards({
	children,
	title,
	autor,
	description,
	stack,
	image,
	index,
	className,
	pj_link,
}: CardsProps) {
	const Image = () => {
		const default_colors: string[] = [
			twstr`bg-blue-950`,
			twstr`bg-green-950`,
			twstr`bg-amber-950`,
			twstr`bg-emerald-950`,
		];

		if (image)
			return (
				<img
					src={image}
					width={208}
					height={208}
					alt={title}
					className="w-52 h-52 object-cover"
				/>
			);
		return <div className={cn(default_colors[(!index && index !== 0) ? 1 : index % default_colors.length], "w-52 h-52 flex justify-center items-center")}>
			<img src="/gh.svg" alt="no project reference" className='brightness-0 invert opacity-80' loading='lazy' />
		</div>;
	};

	return (
		<div
			className={cn(
				'flex flex-row gap-4 rounded-lg border border-neutral-700 p-4',
				className,
			)}
		>
			<Image />

			<div className="flex flex-1 flex-col justify-center gap-y-3">
				<div className='flex justify-between items-center w-full'>
					<h3 className="text-lg font-bold">{title}</h3>
						<Text.A className='w-6 h-6 hover:bg-neutral-700 hover:cursor-pointer flex items-center justify-center rounded-full' link={pj_link}>
							<ArrowOutwardIcon fontSize='small' className='text-neutral-400' />
						</Text.A>
				</div>

				<p className="text-sm text-neutral-400">{description}</p>

				<div className="justify-between flex items-center">
					<div className='flex flex-wrap gap-2 mt-1'>
						{stack.map((tech) => (
							<span
								key={tech}
								className="bg-transparent ring-1 ring-neutral-700 px-2 py-0.5 text-xs"
							>
								{tech}
							</span>
						))}
					</div>
					<Text.A
						link={autor.link}
						className="text-xs hover:underline text-emphasis-secondary"
					>
						@{autor.name.toLocaleLowerCase()}
					</Text.A>
				</div>
			</div>
			{children}
		</div>
	);
}

export default Cards