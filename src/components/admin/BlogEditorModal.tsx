import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Sparkles, Eye, Code, Clock, Calendar, Check, Heading2, Heading3, Bold, Quote, List, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BlogPost, createBlogPost, updateBlogPost, generateSlug } from "@/services/blogService";

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: BlogPost | null;
  onSuccess: () => void;
}

const IMAGE_PRESETS = [
  { label: "Marketing", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop" },
  { label: "Social Media", url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=500&fit=crop" },
  { label: "E-Commerce", url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&h=500&fit=crop" },
  { label: "Branding & Strategy", url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=500&fit=crop" },
  { label: "Analytics & Ads", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop" },
];

export const BlogEditorModal = ({
  isOpen,
  onClose,
  postToEdit,
  onSuccess,
}: BlogEditorModalProps) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [activeLangTab, setActiveLangTab] = useState<"ar" | "en">(isArabic ? "ar" : "en");
  const [activeViewTab, setActiveViewTab] = useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [excerptAr, setExcerptAr] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [readTime, setReadTime] = useState(5);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"published" | "draft">("published");

  useEffect(() => {
    if (postToEdit) {
      setTitleAr(postToEdit.title?.ar || "");
      setTitleEn(postToEdit.title?.en || "");
      setExcerptAr(postToEdit.excerpt?.ar || "");
      setExcerptEn(postToEdit.excerpt?.en || "");
      setContentAr(postToEdit.content?.ar || "");
      setContentEn(postToEdit.content?.en || "");
      setSlug(postToEdit.slug || "");
      setImage(postToEdit.image || IMAGE_PRESETS[0].url);
      setReadTime(postToEdit.readTime || 5);
      setDate(postToEdit.date || new Date().toISOString().split("T")[0]);
      setStatus(postToEdit.status || "published");
    } else {
      // Reset form
      setTitleAr("");
      setTitleEn("");
      setExcerptAr("");
      setExcerptEn("");
      setContentAr("");
      setContentEn("");
      setSlug("");
      setImage(IMAGE_PRESETS[0].url);
      setReadTime(5);
      setDate(new Date().toISOString().split("T")[0]);
      setStatus("published");
    }
  }, [postToEdit, isOpen]);

  if (!isOpen) return null;

  // Insert formatting into textarea
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const isAr = activeLangTab === "ar";
    const currentContent = isAr ? contentAr : contentEn;
    const setContent = isAr ? setContentAr : setContentEn;

    const textarea = document.getElementById(isAr ? "blog-content-ar" : "blog-content-en") as HTMLTextAreaElement;
    if (!textarea) {
      setContent(currentContent + `\n${prefix}${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentContent.substring(start, end);
    const newText = currentContent.substring(0, start) + prefix + selectedText + suffix + currentContent.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  };

  // Auto-generate slug from English or Arabic title
  const handleAutoSlug = () => {
    const sourceText = titleEn.trim() || titleAr.trim();
    if (!sourceText) {
      toast.error(isArabic ? "يرجى كتابة عنوان المقال أولاً" : "Please enter a title first");
      return;
    }
    const generated = generateSlug(sourceText);
    setSlug(generated);
    toast.success(isArabic ? "تم توليد الرابط بنجاح" : "Slug generated successfully");
  };

  // Auto-calculate read time
  const handleCalculateReadTime = () => {
    const content = (contentAr + " " + contentEn).trim();
    const wordsCount = content ? content.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(wordsCount / 180));
    setReadTime(minutes);
    toast.success(isArabic ? `تم ضبط وقت القراءة: ${minutes} دقيقة` : `Read time set to ${minutes} min`);
  };

  // Preview Formatter
  const renderMarkdownPreview = (text: string) => {
    if (!text.trim()) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {isArabic ? "المحتوى فارغ حالياً، ابدأ بالكتابة لعرض المعاينة" : "Content is currently empty. Start writing to see preview."}
        </div>
      );
    }

    const blocks = text.split("\n\n");
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith("## ")) {
        return <h2 key={i} className="text-xl md:text-2xl font-bold mt-6 mb-3 text-foreground">{trimmed.replace("## ", "")}</h2>;
      }
      if (trimmed.startsWith("### ")) {
        return <h3 key={i} className="text-lg md:text-xl font-bold mt-4 mb-2 text-foreground">{trimmed.replace("### ", "")}</h3>;
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={i} className="border-s-4 border-primary ps-4 py-2 my-4 bg-primary/5 rounded-e-lg text-foreground/90 italic">
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }
      if (trimmed === "---") {
        return <hr key={i} className="my-6 border-border" />;
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
        const items = trimmed.split("\n").filter((l) => l.trim());
        return (
          <ul key={i} className="space-y-1.5 my-3 ps-4 list-disc text-muted-foreground">
            {items.map((item, j) => (
              <li key={j}>{item.replace(/^[-\d.]\s*/, "")}</li>
            ))}
          </ul>
        );
      }
      return <p key={i} className="text-muted-foreground leading-relaxed mb-3">{trimmed}</p>;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!titleAr.trim() && !titleEn.trim()) {
      toast.error(isArabic ? "يرجى إدخال عنوان المقال بالعربية أو الإنجليزية" : "Please enter a title in Arabic or English");
      return;
    }

    let finalSlug = slug.trim();
    if (!finalSlug) {
      finalSlug = generateSlug(titleEn || titleAr);
      setSlug(finalSlug);
    }

    if (!finalSlug) {
      toast.error(isArabic ? "يرجى تحديد رابط المقال (Slug)" : "Please provide a URL slug");
      return;
    }

    setIsSubmitting(true);

    const postPayload = {
      slug: finalSlug,
      title: {
        ar: titleAr.trim() || titleEn.trim(),
        en: titleEn.trim() || titleAr.trim(),
      },
      excerpt: {
        ar: excerptAr.trim() || excerptEn.trim(),
        en: excerptEn.trim() || excerptAr.trim(),
      },
      content: {
        ar: contentAr.trim() || contentEn.trim(),
        en: contentEn.trim() || contentAr.trim(),
      },
      image: image.trim() || IMAGE_PRESETS[0].url,
      readTime: Number(readTime) || 5,
      date: date || new Date().toISOString().split("T")[0],
      status,
    };

    try {
      if (postToEdit && postToEdit.id) {
        const res = await updateBlogPost(postToEdit.id, postPayload);
        if (res.success) {
          toast.success(isArabic ? "تم تحديث المقال بنجاح!" : "Blog post updated successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(res.error || (isArabic ? "فشل تحديث المقال" : "Failed to update blog post"));
        }
      } else {
        const res = await createBlogPost(postPayload);
        if (res.success) {
          toast.success(isArabic ? "تم نشر المقال بنجاح!" : "Blog post published successfully!");
          onSuccess();
          onClose();
        } else {
          toast.error(res.error || (isArabic ? "فشل إنشاء المقال" : "Failed to create blog post"));
        }
      }
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "حدث خطأ غير متوقع" : "An unexpected error occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-background rounded-2xl shadow-2xl border border-border flex flex-col z-[121] overflow-hidden"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/30">
            <div>
              <h2 className="text-xl font-bold font-serif text-foreground">
                {postToEdit
                  ? isArabic ? "تعديل المقال" : "Edit Blog Post"
                  : isArabic ? "إضافة مقال جديد للمدونة" : "Create New Blog Post"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isArabic
                  ? "سيتم حفظ المقال في قاعدة بيانات Firebase وسيظهر مباشرة في الموقع"
                  : "Post will be saved to Firebase and rendered live on the website"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-start">
            {/* Language Tabs & View Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
              <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveLangTab("ar")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeLangTab === "ar"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  العربية (Arabic)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab("en")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeLangTab === "en"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  English
                </button>
              </div>

              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveViewTab("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeViewTab === "edit"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  {isArabic ? "محرر النصوص" : "Editor"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeViewTab === "preview"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isArabic ? "معاينة حية" : "Live Preview"}
                </button>
              </div>
            </div>

            {/* Arabic Fields */}
            {activeLangTab === "ar" && (
              <div className="space-y-4" dir="rtl">
                <div>
                  <Label htmlFor="title-ar" className="text-sm font-semibold text-foreground mb-1.5 block">
                    عنوان المقال (بالعربية) *
                  </Label>
                  <Input
                    id="title-ar"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: كيف تنجح في التسويق الرقمي لعلامتك التجارية في 2026؟"
                    className="text-base font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt-ar" className="text-sm font-semibold text-foreground mb-1.5 block">
                    مقتطف / نبذة مختصرة (بالعربية)
                  </Label>
                  <textarea
                    id="excerpt-ar"
                    value={excerptAr}
                    onChange={(e) => setExcerptAr(e.target.value)}
                    rows={2}
                    placeholder="موجز سريع يظهر في بطاقات المدونة وقنوات التواصل..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {activeViewTab === "edit" ? (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <Label htmlFor="blog-content-ar" className="text-sm font-semibold text-foreground">
                        محتوى المقال (Markdown مدعوم)
                      </Label>
                      {/* Markdown Toolbar */}
                      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-md text-xs">
                        <button
                          type="button"
                          onClick={() => insertFormatting("## ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="عنوان رئيسي (H2)"
                        >
                          <Heading2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("### ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="عنوان فرعي (H3)"
                        >
                          <Heading3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("**", "**")}
                          className="p-1 hover:bg-background rounded"
                          title="نص عريض (Bold)"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("> ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="اقتباس (Quote)"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("- ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="قائمة نقطية"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("\n---\n", "")}
                          className="p-1 hover:bg-background rounded"
                          title="خط فاصل"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="blog-content-ar"
                      value={contentAr}
                      onChange={(e) => setContentAr(e.target.value)}
                      rows={10}
                      placeholder="اكتب محتوى المقال هنا... يمكنك استخدام ## للعناوين و **للنص العريض** و - للقوائم."
                      className="w-full font-mono text-sm rounded-md border border-input bg-background p-3 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-muted/20 border border-border/70 rounded-xl min-h-[250px]">
                    <div className="text-xs uppercase tracking-wider text-primary font-bold mb-3">
                      معاينة المحتوى العربي
                    </div>
                    {renderMarkdownPreview(contentAr)}
                  </div>
                )}
              </div>
            )}

            {/* English Fields */}
            {activeLangTab === "en" && (
              <div className="space-y-4" dir="ltr">
                <div>
                  <Label htmlFor="title-en" className="text-sm font-semibold text-foreground mb-1.5 block">
                    Article Title (English) *
                  </Label>
                  <Input
                    id="title-en"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Example: How to Succeed in Digital Marketing for Your Business in 2026"
                    className="text-base font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt-en" className="text-sm font-semibold text-foreground mb-1.5 block">
                    Excerpt / Short Summary (English)
                  </Label>
                  <textarea
                    id="excerpt-en"
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    rows={2}
                    placeholder="Brief summary shown on blog cards and social sharing..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                {activeViewTab === "edit" ? (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <Label htmlFor="blog-content-en" className="text-sm font-semibold text-foreground">
                        Article Content (Markdown Supported)
                      </Label>
                      {/* Markdown Toolbar */}
                      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-md text-xs">
                        <button
                          type="button"
                          onClick={() => insertFormatting("## ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="H2 Heading"
                        >
                          <Heading2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("### ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="H3 Heading"
                        >
                          <Heading3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("**", "**")}
                          className="p-1 hover:bg-background rounded"
                          title="Bold Text"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("> ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="Blockquote"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("- ", "")}
                          className="p-1 hover:bg-background rounded"
                          title="Bullet list"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting("\n---\n", "")}
                          className="p-1 hover:bg-background rounded"
                          title="Divider"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="blog-content-en"
                      value={contentEn}
                      onChange={(e) => setContentEn(e.target.value)}
                      rows={10}
                      placeholder="Write article content here... You can use ## for Headings, **bold**, and - for lists."
                      className="w-full font-mono text-sm rounded-md border border-input bg-background p-3 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-muted/20 border border-border/70 rounded-xl min-h-[250px]">
                    <div className="text-xs uppercase tracking-wider text-primary font-bold mb-3">
                      English Content Preview
                    </div>
                    {renderMarkdownPreview(contentEn)}
                  </div>
                )}
              </div>
            )}

            {/* General Configurations */}
            <div className="pt-4 border-t border-border/60 space-y-4">
              <h3 className="text-sm font-bold text-foreground">
                {isArabic ? "إعدادات المقال والرابط" : "Post Configuration & Meta"}
              </h3>

              {/* URL Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="slug" className="text-xs font-semibold text-foreground">
                    {isArabic ? "معرّف الرابط (Slug) *" : "URL Slug *"}
                  </Label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    {isArabic ? "توليد من العنوان" : "Auto-generate"}
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="bg-muted px-3 py-2 text-xs text-muted-foreground border border-input rounded-s-md border-e-0 select-none">
                    /blog/
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="digital-marketing-tips-2026"
                    className="rounded-s-none font-mono text-sm"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <Label htmlFor="image" className="text-xs font-semibold text-foreground mb-1.5 block">
                  {isArabic ? "رابط الصورة البارزة (Featured Image URL)" : "Featured Image URL"}
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="pl-9 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Preset suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-xs text-muted-foreground me-1">
                    {isArabic ? "نماذج سريعة:" : "Presets:"}
                  </span>
                  {IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        image === preset.url
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Image Preview Thumbnail */}
                {image && (
                  <div className="mt-2 relative w-36 h-20 rounded-lg overflow-hidden border border-border shadow-sm">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Grid: Read Time, Date, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="readTime" className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {isArabic ? "وقت القراءة (دقائق)" : "Read Time (min)"}
                    </Label>
                    <button
                      type="button"
                      onClick={handleCalculateReadTime}
                      className="text-[11px] text-primary hover:underline"
                    >
                      {isArabic ? "احسب" : "Auto"}
                    </button>
                  </div>
                  <Input
                    id="readTime"
                    type="number"
                    min={1}
                    max={60}
                    value={readTime}
                    onChange={(e) => setReadTime(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {isArabic ? "تاريخ النشر" : "Publish Date"}
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-xs font-semibold text-foreground mb-1.5 block">
                    {isArabic ? "حالة المقال" : "Publication Status"}
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="published">{isArabic ? "منشور علناً (Published)" : "Published (Live)"}</option>
                    <option value="draft">{isArabic ? "مسودة (Draft)" : "Draft (Hidden)"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/60">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[130px]">
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {postToEdit
                  ? isArabic ? "حفظ التغييرات" : "Save Changes"
                  : isArabic ? "نشر المقال" : "Publish Post"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
