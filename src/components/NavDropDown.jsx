import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function NavDropDown(props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none text-base" asChild>
        <button className="border-none outline-none hover:none">
          {props.title}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{props.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={props.create} onClick={props.onClick}>
              <Button variant="ghost" className="w-full hover:bg-purple-600">
                {props.createTitle}
              </Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={props.list} onClick={props.onClick}>
              <Button variant="ghost" className="w-full hover:bg-purple-600">
                {props.listTitle}
              </Button>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
