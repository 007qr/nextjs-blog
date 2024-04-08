"use client";
import Image from "next/image";
import { db } from "../firebase";
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,  
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
import { useMemo, useState } from "react";
import Link from "next/link";
import { Blog } from "~/lib/utils";
import { DeleteIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Array<{ id: string; data: Blog; }>>();

  useMemo(() => {
    (async () => {
      let blogs = (await getDocs((collection(db, "blogs")))).docs.map((doc => { return { id: doc.id, data: doc.data() as Blog } }));
      blogs = blogs.filter((blog) => blog.data.published === false);
      setBlogs(blogs);
    })()
  }, []);

  const handleDeleteBlog = async (id:string)  => {
    const deletePromise = deleteDoc(doc(db, "blogs", id));
    return new Promise((resolve) => {
      toast.promise(
        deletePromise.then(() => {
          setBlogs(blogs ? blogs.filter((blog) => blog.id !== id) : []);
        }).catch((e) => {
          console.log(e);
          throw new Error(`Error deleting blog. Please try again.`);
        }),
        {
          loading: 'Deleting blog....',
          success: 'Blog deleted Successfully',
          error: (e) => e.message,
        }
      )
    })

  }

  const handleUpdateBlog = (id: string) => {
    router.push(`/update-blog/${id}`)
  }

  return (
    <>
      <div className="max-w-[1224px] mx-auto my-16 grid lg:grid-cols-3 auto-rows-[1fr] gap-[24px] md:grid-cols-2 grid-cols-1 justify-items-center">

        {
          blogs ? blogs.length? blogs.map((blog) => {
            return (
              <ContextMenu key={blog.id}>
                <ContextMenuTrigger>
                  <Link href={`/update-blog/${blog.id}`}  className="h-full">
                    <Card className="w-[350px] h-[450px] dark:bg-secondary">
                      <CardContent className="p-6 pb-0">
                        <div className="relative w-full">
                          <Image src={blog.data.imageURL} className="w-[350px] h-[200px] object-cover" width={350} height={100} alt='cover-image' />
                        </div>
                      </CardContent>
                      <CardHeader>
                        <CardTitle>{blog.data.title}</CardTitle>
                        <CardDescription className="pt-[8px]">{blog.data.shortDesc.length >= 115 ? blog.data.shortDesc.slice(0, 115) + '...' : blog.data.shortDesc}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                <ContextMenuItem className="hover:[background-color:#6366f1!important] hover:[color:white!important]" onClick={() => handleUpdateBlog(blog.id)}>
                    Update
                    <ContextMenuShortcut>
                      <PencilIcon className="w-4 h-4" />
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem className="hover:[background-color:#ef4444!important] hover:[color:white!important]" onClick={() => handleDeleteBlog(blog.id)}>
                    Delete
                    <ContextMenuShortcut>
                      <DeleteIcon className="w-4 h-4" />
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          }):<p className="text-[17px]">Nothing in your drafts (:</p> : <p className="text-[17px]">Loading...</p>
        }
      </div>
    </>
  );
}