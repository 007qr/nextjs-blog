"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Navbar() {
    const path = usePathname();

    return (
        <>
            <div className="flex items-center justify-between">
                <Link href='/'>
                    <div className="flex items-center gap-[12px]">
                        <Image src="/logo.svg" width={74} height={74} alt="logo" />
                        <p className="text-[27px] font-medium leading-[110%]">Neural Nook</p>
                    </div>
                </Link>
                <div>
                    {path === "/" ? (
                        <Link href="/add-blog">
                            <Button variant="outline" size="sm">
                                Add Blog
                            </Button>
                        </Link>) : null}
                </div>
            </div>
        </>
    )
}