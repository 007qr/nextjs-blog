"use client";

import Image from "next/image";
import { db } from "./firebase";
import { getDocs, collection } from 'firebase/firestore'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Blog } from "~/lib/utils";

export default function Home() {

  const [blogs, setBlogs] = useState<Array<{ id: string; data: Blog; }>>([]);

  useEffect(() => {
    (async () => {
      const blogs = (await getDocs((collection(db, "blogs")))).docs.map((doc => { return { id: doc.id, data: doc.data() as Blog } }));
      setBlogs(blogs);
    })()
  }, []);

  return (
    <>
      <div className="my-[36px] grid lg:grid-cols-3 gap-[24px] md:grid-cols-2 grid-cols-1 justify-items-center">
        {
          blogs.map((blog) => {
            return (
              <Link href={`/blog/${blog.id}`} key={blog.id}>
                <Card className="w-[350px]">
                  <CardContent className="p-6 pb-0">
                    <div className="relative w-full">
                      <Image src={blog.data.imageURL} width={350} height={200} alt='asd' />
                    </div>
                  </CardContent>
                  <CardHeader>
                    <CardTitle>{blog.data.title}</CardTitle>
                    <CardDescription>{blog.data.shortDesc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })
        }
      </div>
    </>
  );
}

// Image upload --> vercel blob
// getStaticParams --> 
// AI Text generation --> 