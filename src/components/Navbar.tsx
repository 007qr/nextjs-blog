"use client";
import { PenBox, PenLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Navbar() {
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
                    {path.includes('/blog/') ? (<>
                        <Link href={`/update-blog/${path.split("/")[2]}`}>
                            <Button variant="secondary" size="sm" className="flex gap-[8px]">
                                <PenLine className="w-4 h-4" /> Update Blog
                            </Button>
                        </Link>
                    </>) : <Link href="/add-blog">
                        <Button variant="outline" size="sm" className="flex gap-[8px]">
                            <PenBox className="w-4 h-4" /> Write
                        </Button>
                    </Link>}
                    
                </div>
            </div>
        </>
    )
}