import { type ReactNode, useState } from "react";
import { Minimize2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


function RightPanelMenu(
	{ children, title, raiseButtonContent, articleClass = null }:
		{ children: ReactNode, title: string, raiseButtonContent: ReactNode, articleClass?: string | null, }
) {
	const [IsRaised, setIsRaised] = useState(false);

	function Raised() {
		return (
			<div className='min-w-md  min-h-1/2 rounded-l-sm bg-muted pointer-events-auto
				flex flex-col gap-4 anim-right-slidein overflow-hidden'>
				{/* Uses semantic tagging- consists of a header, article (dominant content) with no footer. */}
				<header className="p-4 flex flex-row w-full place-content-between place-items-center bg-primary text-primary-foreground">
					<Button size="fit" variant="ghost" className="p-2" onClick={() => setIsRaised(false)}>
						<Minimize2 className='size-8' />
					</Button>
					<span className="flex flex-row gap-4 place-items-center">
						<h1 className="h1">{title}</h1>
					</span>
					<div className="size-8"></div>
				</header>
				<article className={cn("p-4 overflow-hidden h-full", articleClass)}>
					{children}
				</article>
			</div>
		)

	}

	function Hidden() {
		return (
			<Button className='pointer-events-auto rounded-l-sm' size="fit" variant="overmap" onClick={() => setIsRaised(true)}>
				{raiseButtonContent}
			</Button>
		)
	}

	return IsRaised ? Raised() : Hidden();
}



export default RightPanelMenu;