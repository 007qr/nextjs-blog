"use client";
import { CircleDashedIcon, CloudUpload, Loader2, UploadIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { slugify } from "~/lib/utils";
import { db } from "../firebase";
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { useToast } from "~/components/ui/use-toast";
import Image from "next/image";
import { nanoid } from "nanoid";


const Editor = dynamic(() => import("~/steven-tey-novel/advanced-editor"), { ssr: false });

export default function AddBlog() {
    const { toast } = useToast();
    const router = useRouter();
    const [title, setTitle] = useState<string>("Beyond the Basics: Exploring the Frontiers of Neural Networks");
    const [shortDesc, setShortDesc] = useState<string>("In the ever-evolving landscape of artificial intelligence, neural networks continue to stand at the forefront of innovation. While their fundamental principles remain steadfast, researchers and practitioners are constantly pushing the boundaries of what these powerful algorithms can achieve. Join me on a journey as we delve into the latest advancements and emerging trends shaping the future of neural networks.");
    const [slug, setSlug] = useState<string>("");

    const imgInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string>("https://firebasestorage.googleapis.com/v0/b/nextjs-personal-blog.appspot.com/o/cover-images%2FNeural-Networks-Architecture.png0NxkV1nhQiORhqY51LuxY?alt=media&token=c4ec12aa-d0e4-4a5f-810b-426cf6825223");
    const storage = getStorage()

    const addBlog = async ({draft}:{draft:boolean}) => {
        if (draft || (title !== '' && window.localStorage.getItem("novel-content") != '' && imageURL != '' && shortDesc != '')) {
            console.log('clicked');
            try {
                const docRef = await addDoc(collection(db, 'blogs'), {
                    title,
                    slug,
                    imageURL,
                    content: window.localStorage.getItem("novel-content"),
                    published: !draft,
                    shortDesc,
                    createdAt: new Date()
                })
                toast({
                    title: draft ? "Saved as draft" : "Post created successfully!"
                })
                router.push(draft ? '': `/blog/${docRef.id}`);
            } catch (e) {
                toast({
                    variant: "destructive",
                    title: "Something went wrong while creating post."
                })
            }

        } else {
            toast({
                variant: "destructive",
                title: "You need to fill all the fields."
            })
        }
    }

    const handleUploadImage = async (file: File): Promise<string> => {
        try {
            const storageRef = ref(storage, `cover-images/${file.name + nanoid()}`);
            const uploaded = await uploadBytes(storageRef, file);
            return getDownloadURL(uploaded.ref);
        } catch (e) {
            console.log(e);
            return "";
        }
    }

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const imageFile = e.target.files[0]; // select the first file if multiple files are present

            if (imageFile && imageFile.type.startsWith("image/")) {
                // upload the file
                setUploading(true);
                const res = await handleUploadImage(imageFile);

                if (!res) {
                    toast({
                        title: "Something went wrong while uploading cover image.",
                        variant: "destructive"
                    }) // show user --> error
                } else {
                    setImageURL(res);
                }
                setUploading(false);

            }
        }
    }

    return (
        <>
            <div className="max-w-[780px] mx-auto mt-[3.88em]">
                <div className="flex justify-between items-center">
                    <h1 className="text-[35px] font-medium">Write and publish your Blog</h1>
                    <div className="flex gap-[12px]">
                        <Button className="flex gap-[8px] h-8" onClick={() => {addBlog({draft:true})}} size="sm" variant="outline">
                        <CircleDashedIcon className="w-5 h-5" /> Save as Draft 
                        </Button>
                        <Button className="dark:text-white flex gap-[8px] h-8 bg-green-500 hover:bg-green-500/90" onClick={() => addBlog({draft:false})} size="sm">
                        <CloudUpload className="w-5 h-5" /> Publish 
                        </Button>
                    </div>
                </div>
                <div className="space-y-[12px] w-full my-[36px]">
                    <Label htmlFor="title" className="text-[15px]">
                        Title <span className="text-red-500">*</span>
                    </Label>
                    <Input id="title" value={title} className="col-span-3" onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)) }} placeholder="e.g Unlocking the Power of Neural Networks: A Deep Dive" />
                </div>
                <div className="space-y-[12px] w-full my-[36px]">
                    <Label htmlFor="short_description" className="text-[15px]">
                        Short Description <span className="text-red-500">*</span>
                    </Label>
                    <Input id="short_description" value={shortDesc} className="col-span-3" onChange={(e) => { setShortDesc(e.target.value); }} placeholder={"Unlocking the Power of Neural Networks: A Deep Dive\" delves into the transformative potential of neural networks in artificial intelligence..."} />
                </div>
                <div className="my-[36px] space-y-[12px]">
                    <Label htmlFor="title" className="text-[15px]">
                        Upload Cover Image <span className="text-red-500">*</span>
                    </Label>
                    <input type="file" name="" id="" hidden ref={imgInputRef} accept="image/*" onChange={handleInputChange} />
                    {imageURL !== "" ? (
                        <>
                            <div className="relative w-max">
                                <Image src={imageURL} width={120} height={120} alt="asd" />
                                <div className="bg-neutral-500 w-min rounded-full absolute -top-1 -right-2 cursor-pointer" onClick={() => setImageURL("")}>
                                    <X className="text-white w-5 h-5 p-0.5" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <Button className="flex gap-[8px]" size="sm" onClick={() => { imgInputRef.current!.click() }} disabled={uploading}>
                            {uploading ?
                                (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </>
                                )
                                : (
                                    <>
                                        <UploadIcon className="w-5 h-5" /> Upload Image
                                    </>
                                )}
                        </Button>
                    )}
                </div>
                <div className="space-y-[12px]">
                    <Label className="text-[15px]">
                        Content<span className="text-red-500">*</span>
                    </Label>
                    <div className="border min-h-[500px] p-[12px] rounded-md">
                        <Editor editable={true}/>
                    </div>
                </div>
            </div>
        </>
    )
}