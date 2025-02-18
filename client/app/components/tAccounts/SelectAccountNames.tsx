import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface Props {
  accountName: string;
  accountNames: string[];
  sendData: (accountName: string) => void;
}

export default function SelectAccountNames({
  accountName,
  accountNames,
  sendData,
}: Props) {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const selectedName = searchParams.get("name");
    if (selectedName && accountNames.includes(selectedName)) {
      setValue(selectedName);
    }

    if (accountName) {
      setValue(accountName);
    }
  }, [searchParams, accountNames, accountName]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[250px] justify-between"
        >
          {value ? value : "Select Account Name"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search Account Name" />
          <CommandList>
            <CommandEmpty>No name found.</CommandEmpty>
            <CommandGroup>
              {accountNames.map((accountName, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setValue(accountName);
                    setOpen(false);
                    sendData(accountName);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === accountName ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {accountName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
