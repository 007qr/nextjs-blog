import { notFound } from "next/navigation"
import { db } from "../../firebase";
import { collection, query, where, getDocs, documentId } from 'firebase/firestore'
import Image from "next/image";
import { formatDate } from "~/lib/utils";

interface BlogPageProps {
    params: {
        id: string
    }
}

export async function generateStaticParams() {
    const blogs: Array<{ id: string }> = (await getDocs(collection(db, "blogs"))).docs.map((doc) => ({id: doc.id}));
    return blogs;
}

export default async function BlogPage({params}: BlogPageProps) {
    const q = query(collection(db, "blogs"), where(documentId(), "==", params.id));
    const docSnap = await getDocs(q);
    const blogDoc = docSnap.docs[0]
    const data = blogDoc.data();
    
    if (blogDoc.exists()) {
        return (
            <>
                <div className="">
                    <h1 className="text-[45px] font-semibold my-[12px] leading-[120%]">{data?.title}</h1>
                    <div className="flex gap-[12px] items-center mb-[26px]">
                        <Image src="/profile.jpg" alt="" width={70} height={70} className="rounded-full" />
                        <div className="space-y-[4px]">
                            <p className="text-[15px]">Ayush Patil</p>
                            <p className="text-black/70 text-[13px]">{formatDate(data?.createdAt || new Date())}</p>
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

