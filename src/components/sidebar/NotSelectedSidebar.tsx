import { MapPinOff } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function NotSelectedSidebar(
    { hideFunc }:
        {
            hideFunc: React.MouseEventHandler;
        }
) {
    return (
        <>
            <Sidebar title="" hideFunc={hideFunc}>
                <div className="flex items-center flex-col pt-30 gap-5">
                    <MapPinOff className="size-40" color="#9ca3af" />
                    <h1 className="h1 text-gray-400">No Tiploc Selected</h1>
                </div>
            </Sidebar>
        </>
    );
}