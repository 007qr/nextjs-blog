"use client";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { db } from "~/app/firebase";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"
import { Blog } from "~/lib/utils";


export default function SearchCommand({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [blogs, setBlogs] = useState<Array<{ id: string; data: Blog; }>>();
    const router = useRouter();

    useEffect(() => {
        // Setting shortcut key for command box
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)


    }, [setOpen]);

    useEffect(() => {
        (async () => {
            let blogs = (await getDocs((collection(db, "blogs")))).docs.map((doc => { return { id: doc.id, data: doc.data() as Blog } }));
            blogs = blogs.filter((blog) => blog.data.published === true);
            setBlogs(blogs);
        })()
    }, [open]);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <Command >
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        {
                            blogs ? blogs.length ?
                                (
                                    blogs.map((blog) => (
                                        <CommandItem key={blog.id} className="aria-selected:bg-blue-500 aria-selected:text-white" onSelect={() => { router.push(`/blog/${blog.id}`); setOpen(false) }} >
                                            <span>{blog.data.title}</span>
                                        </CommandItem>
                                    ))
                                ) : null : null
                        }
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    )
}