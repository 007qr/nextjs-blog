"use client";
import { notFound } from "next/navigation"
import { db } from "../../firebase";
import { collection, query, where, getDocs, documentId } from 'firebase/firestore'
import { useEffect, useState } from "react";
import { Blog, formatDate } from "~/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("~/steven-tey-novel/advanced-editor"), { ssr: false });

interface BlogPageProps {
    params: {
        id: string
    }
}

export default function BlogPage({ params }: BlogPageProps) {
    const [data, setData] = useState<Blog>();
    const [mounted, setMounted] = useState<boolean>(true);

    useEffect(() => {
        (async () => {

            const q = query(collection(db, "blogs"), where(documentId(), "==", params.id));
            const docSnap = await getDocs(q);


            if (!docSnap.docs.length) {
                setMounted(false);
            }

            setData(docSnap.docs[0].data() as Blog);
        })()
    }, []);


    if (mounted) {
        return (
            <>
                {data ? (
                    <div className="max-w-[680px] mx-auto mt-[3.88em]">
                        <h1 className="text-[42px] font-semibold leading-[52px] mb-[24px]">{data?.title}</h1>
                        <div className="w-full border border-neutral-300 h-[0.5px]" />
                        <div className="flex gap-[12px] items-center my-[16px]">
                            <Image src="/profile.jpg" alt="" width={44} height={44} className="rounded-full" />
                            <div className="space-y-[4px]">
                                <p className="text-[15px]">Ayush Patil</p>
                                <p className="text-black/70 text-[13px]">{formatDate(String(data.createdAt.toDate()))}</p>
                            </div>
                        </div>
                        <div className="w-full border border-neutral-300 h-[0.5px]" />
                        <div className="h-[650px] relative my-[24px]">
                            <Image src={data?.imageURL || ''} alt={`${data?.title}`} fill className="object-cover" />
                        </div>


                        <Editor editable={false} defaultContent={JSON.parse(data?.content || "{}")} />
                    </div>
                ) : <p>Loading...</p>}
            </>
        )
    } else {
        return notFound();
    }
}

