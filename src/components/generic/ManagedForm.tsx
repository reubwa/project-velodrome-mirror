

/* ManagedForm is a small wrapper for default html form that does not redirect the page. */

import type { ReactNode } from "react";

function ManagedForm({ children, onSubmit = _ => { }, className }: { children: ReactNode, onSubmit?: React.SubmitEventHandler<HTMLFormElement>, className?: string | undefined }) {
	return (
		<form onSubmit={e => {
			// Run inner code.
			onSubmit(e);

			// Stop redirection.
			e.preventDefault();
			return false;
		}} className={className}>
			{children}
		</form>
	)
}

export default ManagedForm;