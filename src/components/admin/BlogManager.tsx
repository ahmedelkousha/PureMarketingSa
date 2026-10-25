import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  Calendar,
  Cloud,
  FileCode2,
  CheckCircle2,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  BlogPost,
  subscribeToDynamicBlogs,
  getMergedBlogs,
  deleteBlogPost,
  updateBlogPost,
} from "@/services/blogService";
import { BlogEditorModal } from "./BlogEditorModal";

export const BlogManager = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const lang = (i18n.language as "ar" | "en") || "ar";

  const [dynamicBlogs, setDynamicBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "published" | "draft" | "dynamic" | "static">("all");

  // Modal States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Subscribe to dynamic blogs
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToDynamicBlogs(
      (blogs) => {
        setDynamicBlogs(blogs);
        setLoading(false);
      },
      false // fetch both draft and published for dashboard
    );

    return () => unsubscribe();
  }, []);

  // Merged blogs (static + dynamic)
  const allBlogs = getMergedBlogs(dynamicBlogs, false);

  // Filtered blogs based on search and tab
  const filteredBlogs = allBlogs.filter((post) => {
    // Type Filter
    if (filterType === "published" && post.status !== "published") return false;
    if (filterType === "draft" && post.status !== "draft") return false;
    if (filterType === "dynamic" && post.isStatic) return false;
    if (filterType === "static" && !post.isStatic) return false;

    // Search Filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleAr = (post.title?.ar || "").toLowerCase();
    const titleEn = (post.title?.en || "").toLowerCase();
    const slug = (post.slug || "").toLowerCase();
    return titleAr.includes(q) || titleEn.includes(q) || slug.includes(q);
  });

  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleToggleStatus = async (post: BlogPost) => {
    if (!post.id || post.isStatic) return;
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      const res = await updateBlogPost(post.id, { status: newStatus });
      if (res.success) {
        toast.success(
          newStatus === "published"
            ? (isArabic ? "تم نشر المقال بنجاح" : "Post published successfully")
            : (isArabic ? "تم تحويل المقال إلى مسودة" : "Post saved as draft")
        );
      } else {
        toast.error(res.error || (isArabic ? "فشل تغيير الحالة" : "Failed to toggle status"));
      }
    } catch {
      toast.error(isArabic ? "حدث خطأ أثناء تعديل الحالة" : "Error toggling status");
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete?.id) return;
    setIsDeleting(true);
    try {
      const res = await deleteBlogPost(postToDelete.id);
      if (res.success) {
        toast.success(isArabic ? "تم حذف المقال بنجاح" : "Blog post deleted");
        setPostToDelete(null);
      } else {
        toast.error(res.error || (isArabic ? "فشل حذف المقال" : "Failed to delete post"));
      }
    } catch {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "Error deleting post");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Metrics
  const dynamicCount = dynamicBlogs.length;
  const staticCount = allBlogs.filter((b) => b.isStatic).length;
  const publishedCount = allBlogs.filter((b) => b.status === "published").length;
  const draftCount = allBlogs.filter((b) => b.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {isArabic ? "إجمالي المقالات" : "Total Articles"}
              </p>
              <h3 className="text-2xl font-bold font-serif text-foreground mt-1">
                {allBlogs.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {isArabic ? "المقالات الديناميكية (Firebase)" : "Dynamic (Firebase)"}
              </p>
              <h3 className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-1">
                {dynamicCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Cloud className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {isArabic ? "المقالات المنشورة" : "Published Live"}
              </p>
              <h3 className="text-2xl font-bold font-serif text-blue-600 dark:text-blue-400 mt-1">
                {publishedCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {isArabic ? "المسودات المخفية" : "Drafts (Hidden)"}
              </p>
              <h3 className="text-2xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-1">
                {draftCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <EyeOff className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-serif">
                {isArabic ? "إدارة مقالات المدونة" : "Blog Articles Management"}
              </CardTitle>
              <CardDescription>
                {isArabic
                  ? "يمكنك إضافة مقالات جديدة، تعديلها، أو حذفها عبر Firebase مع الحفاظ على المقالات الثابتة"
                  : "Create, edit, and manage dynamic Firebase blog posts alongside existing static blogs"}
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreate} className="gap-2 shrink-0 shadow-md">
              <Plus className="w-4 h-4" />
              {isArabic ? "إضافة مقال جديد" : "New Blog Post"}
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-border/50">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className="text-xs h-8"
              >
                {isArabic ? "الكل" : "All"} ({allBlogs.length})
              </Button>
              <Button
                variant={filterType === "published" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("published")}
                className="text-xs h-8"
              >
                {isArabic ? "المنشور" : "Published"} ({publishedCount})
              </Button>
              <Button
                variant={filterType === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("draft")}
                className="text-xs h-8"
              >
                {isArabic ? "المسودات" : "Drafts"} ({draftCount})
              </Button>
              <Button
                variant={filterType === "dynamic" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("dynamic")}
                className="text-xs h-8"
              >
                <Cloud className="w-3 h-3 me-1 text-emerald-500" />
                {isArabic ? "ديناميكي" : "Firebase"} ({dynamicCount})
              </Button>
              <Button
                variant={filterType === "static" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("static")}
                className="text-xs h-8"
              >
                <FileCode2 className="w-3 h-3 me-1 text-blue-500" />
                {isArabic ? "ثابت" : "Static"} ({staticCount})
              </Button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? "بحث في المقالات..." : "Search articles..."}
                className="h-8 pl-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
              {isArabic ? "لا توجد مقالات مطابقة للبحث أو التصفية" : "No articles found matching your criteria."}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[80px]">
                      {isArabic ? "الصورة" : "Image"}
                    </TableHead>
                    <TableHead className="min-w-[220px]">
                      {isArabic ? "عنوان المقال" : "Article Title"}
                    </TableHead>
                    <TableHead className="w-[140px]">
                      {isArabic ? "الرابط (Slug)" : "Slug"}
                    </TableHead>
                    <TableHead className="w-[110px]">
                      {isArabic ? "التاريخ" : "Date"}
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      {isArabic ? "النوع" : "Source"}
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      {isArabic ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className="w-[140px] text-center">
                      {isArabic ? "الإجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((post) => {
                    const postTitle = post.title?.[lang] || post.title?.ar || post.title?.en || "Untitled";
                    return (
                      <TableRow key={post.id || post.slug} className="hover:bg-muted/30">
                        {/* Thumbnail */}
                        <TableCell>
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                            <img
                              src={post.image}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </TableCell>

                        {/* Title */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-foreground text-sm line-clamp-1">
                              {postTitle}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {post.excerpt?.[lang] || post.excerpt?.ar || ""}
                            </p>
                          </div>
                        </TableCell>

                        {/* Slug */}
                        <TableCell>
                          <span className="font-mono text-xs bg-muted/70 px-2 py-0.5 rounded text-foreground/80 max-w-[130px] truncate block" title={post.slug}>
                            {post.slug}
                          </span>
                        </TableCell>

                        {/* Date & Read Time */}
                        <TableCell className="whitespace-nowrap">
                          <div className="text-xs text-muted-foreground">
                            <div>{formatDate(post.date)}</div>
                            <div className="flex items-center gap-1 text-[11px] mt-0.5">
                              <Clock className="w-3 h-3" />
                              {post.readTime} {isArabic ? "د" : "min"}
                            </div>
                          </div>
                        </TableCell>

                        {/* Type (Dynamic vs Static) */}
                        <TableCell className="text-center">
                          {post.isStatic ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                              <FileCode2 className="w-3 h-3" />
                              {isArabic ? "ثابت" : "Static"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <Cloud className="w-3 h-3" />
                              {isArabic ? "Firebase" : "Dynamic"}
                            </span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          {post.status === "published" ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                              {isArabic ? "منشور" : "Published"}
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                              {isArabic ? "مسودة" : "Draft"}
                            </span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            {/* View Live */}
                            <a
                              href={`/${lang}/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                              title={isArabic ? "معاينة على الموقع" : "View Live"}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            {/* Dynamic Posts Only: Edit, Toggle, Delete */}
                            {!post.isStatic ? (
                              <>
                                <button
                                  onClick={() => handleOpenEdit(post)}
                                  className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                  title={isArabic ? "تعديل المقال" : "Edit Post"}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(post)}
                                  className="p-1.5 rounded-md hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-colors"
                                  title={
                                    post.status === "published"
                                      ? isArabic ? "تحويل لمسودة" : "Unpublish to Draft"
                                      : isArabic ? "نشر المقال" : "Publish Live"
                                  }
                                >
                                  {post.status === "published" ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => setPostToDelete(post)}
                                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                  title={isArabic ? "حذف المقال" : "Delete Post"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span
                                className="text-[11px] text-muted-foreground/60 px-1 select-none"
                                title={isArabic ? "مقال ثابت مبني داخل الكود" : "Built-in static blog"}
                              >
                                —
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog Editor Modal */}
      <BlogEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        postToEdit={editingPost}
        onSuccess={() => {
          // Real-time listener will automatically update the blogs list
        }}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {postToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPostToDelete(null)}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[130]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-[50%] left-[50%] !-translate-x-[50%] !-translate-y-[50%] w-[90%] max-w-md bg-background p-6 rounded-2xl z-[131] shadow-2xl flex flex-col text-center border overflow-hidden"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-destructive"></div>
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif text-foreground">
                {isArabic ? "حذف المقال من المدونة؟" : "Delete Blog Post?"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {isArabic
                  ? `هل أنت متأكد من حذف مقال "${postToDelete.title?.ar || postToDelete.title?.en}"؟ سيتم حذفه نهائياً من قاعدة بيانات Firebase.`
                  : `Are you sure you want to delete "${postToDelete.title?.en || postToDelete.title?.ar}"? This action cannot be undone.`}
              </p>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="flex-1" onClick={() => setPostToDelete(null)} disabled={isDeleting}>
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button variant="destructive" className="flex-1" onClick={confirmDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isArabic ? "نعم، احذف المقال" : "Yes, Delete"
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
