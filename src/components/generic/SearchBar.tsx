import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

function SearchBar({ onChange, value }: { onChange: (v : any)=> void, value: string }) {
    return (
        <InputGroup>
            <InputGroupInput onChange={(temp)=>{onChange(temp.target.value)}} value={value} placeholder="Search..." className="text-xl" />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    )
}

export default SearchBar;

