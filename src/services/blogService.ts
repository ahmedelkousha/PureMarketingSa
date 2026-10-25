import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { blogPosts as staticBlogPosts } from "@/data/content";

export interface BlogPost {
  id?: string;
  slug: string;
  image: string;
  readTime: number;
  date: string;
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  content: { ar: string; en: string };
  status?: "published" | "draft";
  isStatic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const COLLECTION_NAME = "blogs";

// Helper to convert Firestore doc to BlogPost
const mapDocToBlogPost = (id: string, data: any): BlogPost => {
  const getField = (field: any) => {
    if (!field) return { ar: "", en: "" };
    if (typeof field === "string") return { ar: field, en: field };
    return {
      ar: field.ar || field.en || "",
      en: field.en || field.ar || "",
    };
  };

  return {
    id,
    slug: data.slug || "",
    image: data.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    readTime: Number(data.readTime) || 5,
    date: data.date || new Date().toISOString().split("T")[0],
    title: getField(data.title),
    excerpt: getField(data.excerpt),
    content: getField(data.content),
    status: data.status === "draft" ? "draft" : "published",
    isStatic: false,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || data.date),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || data.date),
  };
};

/**
 * Fetch all dynamic blogs from Firestore (no composite index needed)
 */
export const getDynamicBlogs = async (publishedOnly: boolean = false): Promise<BlogPost[]> => {
  try {
    const blogsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(blogsRef);
    const all = snapshot.docs.map((docSnap) => mapDocToBlogPost(docSnap.id, docSnap.data()));
    return publishedOnly ? all.filter((b) => (b.status || "published") === "published") : all;
  } catch (error) {
    console.error("Could not fetch dynamic blogs from Firestore:", error);
    return [];
  }
};

/**
 * Subscribe to real-time updates for dynamic blogs
 * Uses plain collection reference so it does NOT require any manual composite indexes in Firebase Console.
 */
export const subscribeToDynamicBlogs = (
  callback: (blogs: BlogPost[]) => void,
  publishedOnly: boolean = false
): (() => void) => {
  try {
    const blogsRef = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      blogsRef,
      (snapshot) => {
        const blogs = snapshot.docs.map((docSnap) => mapDocToBlogPost(docSnap.id, docSnap.data()));
        const filtered = publishedOnly
          ? blogs.filter((b) => (b.status || "published") === "published")
          : blogs;
        callback(filtered);
      },
      (error) => {
        console.error("Error listening to dynamic blogs from Firestore:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Failed to subscribe to dynamic blogs:", error);
    return () => {};
  }
};

/**
 * Get merged blogs: Static + Dynamic
 */
export const getMergedBlogs = (
  dynamicBlogs: BlogPost[],
  publishedOnly: boolean = true
): BlogPost[] => {
  // Static blogs marked with isStatic: true and status: 'published'
  const staticList: BlogPost[] = staticBlogPosts.map((post) => ({
    ...post,
    id: `static-${post.slug}`,
    status: "published",
    isStatic: true,
  }));

  const filteredDynamic = publishedOnly
    ? dynamicBlogs.filter((b) => (b.status || "published") === "published")
    : dynamicBlogs;

  // Filter out any static post that might be overridden by a dynamic post with same slug
  const dynamicSlugs = new Set(filteredDynamic.map((b) => b.slug));
  const remainingStatic = staticList.filter((s) => !dynamicSlugs.has(s.slug));

  const combined = [...filteredDynamic, ...remainingStatic];

  // Sort descending by publication date
  return combined.sort((a, b) => {
    const timeA = new Date(a.date || a.createdAt || 0).getTime();
    const timeB = new Date(b.date || b.createdAt || 0).getTime();
    return timeB - timeA;
  });
};

/**
 * Fetch a single blog post by slug (checks static first, then queries Firestore)
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // 1. Check static blogs first
  const staticPost = staticBlogPosts.find((p) => p.slug === slug);
  if (staticPost) {
    return {
      ...staticPost,
      id: `static-${staticPost.slug}`,
      status: "published",
      isStatic: true,
    };
  }

  // 2. Query Firestore by slug
  try {
    const blogsRef = collection(db, COLLECTION_NAME);
    const q = query(blogsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return mapDocToBlogPost(docSnap.id, docSnap.data());
    }
  } catch (error) {
    console.error("Error fetching blog post by slug from Firestore:", error);
  }

  return null;
};

/**
 * Create a new dynamic blog in Firestore
 */
export const createBlogPost = async (
  blogData: Omit<BlogPost, "id" | "isStatic" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Check if slug is unique among static blogs
    const slugExistsInStatic = staticBlogPosts.some((p) => p.slug === blogData.slug);
    if (slugExistsInStatic) {
      return { success: false, error: "A static blog post with this slug already exists." };
    }

    // Check if slug exists in Firestore
    const blogsRef = collection(db, COLLECTION_NAME);
    const q = query(blogsRef, where("slug", "==", blogData.slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { success: false, error: "A blog post with this URL slug already exists. Please choose a unique slug." };
    }

    const now = new Date().toISOString();
    const docRef = await addDoc(blogsRef, {
      ...blogData,
      status: blogData.status || "published",
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return { success: false, error: error.message || "Failed to create blog post" };
  }
};

/**
 * Update an existing dynamic blog in Firestore
 */
export const updateBlogPost = async (
  id: string,
  blogData: Partial<Omit<BlogPost, "id" | "isStatic" | "createdAt" | "updatedAt">>
): Promise<{ success: boolean; error?: string }> => {
  try {
    // If slug is being updated, verify uniqueness
    if (blogData.slug) {
      const slugExistsInStatic = staticBlogPosts.some((p) => p.slug === blogData.slug);
      if (slugExistsInStatic) {
        return { success: false, error: "A static blog post with this slug already exists." };
      }

      const blogsRef = collection(db, COLLECTION_NAME);
      const q = query(blogsRef, where("slug", "==", blogData.slug));
      const snapshot = await getDocs(q);
      const conflict = snapshot.docs.find((d) => d.id !== id);
      if (conflict) {
        return { success: false, error: "A blog post with this URL slug already exists. Please choose a unique slug." };
      }
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...blogData,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return { success: false, error: error.message || "Failed to update blog post" };
  }
};

/**
 * Delete a dynamic blog from Firestore
 */
export const deleteBlogPost = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: error.message || "Failed to delete blog post" };
  }
};

/**
 * Helper to generate a URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0621-\u064A-]/g, "") // support English alphanumeric & Arabic letters
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
