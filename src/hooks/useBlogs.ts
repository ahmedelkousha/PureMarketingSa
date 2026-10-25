import { useState, useEffect } from "react";
import {
  BlogPost,
  subscribeToDynamicBlogs,
  getMergedBlogs,
} from "@/services/blogService";

interface UseBlogsOptions {
  publishedOnly?: boolean;
}

export const useBlogs = (options: UseBlogsOptions = { publishedOnly: true }) => {
  const [dynamicBlogs, setDynamicBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToDynamicBlogs(
      (blogs) => {
        setDynamicBlogs(blogs);
        setLoading(false);
      },
      options.publishedOnly
    );

    return () => {
      unsubscribe();
    };
  }, [options.publishedOnly]);

  const mergedBlogs = getMergedBlogs(dynamicBlogs, options.publishedOnly);

  return {
    blogs: mergedBlogs,
    dynamicBlogs,
    loading,
  };
};
