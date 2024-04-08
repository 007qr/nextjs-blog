"use client";
import { CircleDashed, PenBox, PenLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import SearchCommand from "./search-command";
import { ThemeChanger } from "./theme-changer";
  

export default function Navbar() {
    const [open, setOpen] = useState<boolean>(false);
    const path = usePathname();

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <Link href='/'>
                    <div className="flex items-center gap-[12px]">
                        <Image src="/logo.svg" width={44} height={25} alt="logo" />
                        <p className="text-[19px] font-medium leading-[110%]">Neural Nook</p>
                    </div>
                </Link>

                <div className="flex gap-[12px]">

                    <button className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64" onClick={() => setOpen(true)}>
                        <span className="hidden lg:inline-flex">Search blog...</span>
                        <span className="inline-flex lg:hidden">Search...</span>
                        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>
                    <SearchCommand open={open} setOpen={setOpen} />
                    {path.includes('/blog/') ? (<>
                        <Link href={`/update-blog/${path.split("/")[2]}`}>
                            <Button variant="secondary" size="sm" className="flex gap-[8px] h-8">
                                <PenLine className="w-4 h-4" /> Update Blog
                            </Button>
                        </Link>
                    </>) : <>
                        <Link href="/add-blog">
                            <Button variant="outline" size="sm" className="flex gap-[8px] h-8">
                                <PenBox className="w-4 h-4" /> Write
                            </Button>
                        </Link>
                        <Link href="/drafts">
                            <Button variant="outline" size="sm" className="flex gap-[8px] h-8">
                                <CircleDashed className="w-4 h-4" /> Drafts
                            </Button>
                        </Link>
                    </>}
                    <ThemeChanger />


                </div>
            </div>
        </>
    )
}