import { type ClassValue, clsx } from "clsx"
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export interface Blog {
  id: string;
  createdAt: Timestamp;
  title: string;
  shortDesc: string
  published: boolean;
  slug: string;
  imageURL: string;
  content: string;
}

export const formatDate = (str: string|undefined) => {
  const date = new Date(str || "");
  const formattedDate = date.toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
  return formattedDate
}