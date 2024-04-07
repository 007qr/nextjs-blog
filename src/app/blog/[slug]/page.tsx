"use client";
import { notFound, usePathname } from "next/navigation"
import { db } from "../../firebase";
import { collection, query, where, getDocs, documentId } from 'firebase/firestore'
import { useEffect, useState } from "react";
import { Blog } from "~/lib/utils";
import Image from "next/image";

export default function BlogPage() {
    const [data, setData] = useState<Blog>();

    const [mounted, setMounted] = useState<boolean>(true);


    useEffect(() => {
        (async () => {




            if (!docSnap.docs.length) {
                setMounted(false);
            }

            setData(docSnap.docs[0].data() as Blog);
        })()
    }, []);

    if (mounted) {
        return (
            <>
                <div className="">
                    <h1 className="text-[45px] font-semibold my-[12px] leading-[120%]">{data?.title}</h1>
                    <div className="flex gap-[12px] items-center mb-[26px]">
                        <Image src="/profile.jpg" alt="" width={70} height={70} className="rounded-full" />
                        <div className="space-y-[4px]">
                            <p className="text-[15px]">Ayush Patil</p>
                            <p className="text-black/70 text-[13px]">Mar 30, 2024</p>
                        </div>
                    </div>
                    <div className="h-[650px] relative">
                        <Image src={data?.imageURL || ''} alt={`${data?.title}`} fill className="object-cover" />
                    </div>
                </div>
            </>
        )
    } else {
        return notFound();
    }
}

// export async function generateStaticParams() {
//     const path = usePathname().split("/")[2]; // get blog slug from the path
//     const q = query(collection(db, "blogs"), where(documentId(), "==", path));
//     const docSnap = await getDocs(q);
// }