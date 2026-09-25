import { Button } from "../ui/button";

export function SidebarHeaderActionButton({ children, clickHandler }: { children: React.ReactNode, clickHandler: React.MouseEventHandler }) {
    return (
        <Button size="fit" variant="ghost" className="pointer p-[5px]" onClick={clickHandler}>
            {children}
        </Button>
    );
}