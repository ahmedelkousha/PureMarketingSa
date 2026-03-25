import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  Phone,
  ZoomIn,
  X,
  Play,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type VideoItem = { id: number; type: "youtube"; src: string; title: string };

/** Returns the correct iframe src for YouTube / Vimeo embeds */
const getEmbedSrc = (item: VideoItem): string => {
  if (item.type === "youtube")
    return `https://www.youtube.com/embed/${item.src}?rel=0`;
  if (item.type === "vimeo")
    return `https://player.vimeo.com/video/${item.src}`;
  return "";
}

export const VideoCarouselSection = ({
  videos,
  isRTL,
}: {
  videos: VideoItem[];
  isRTL: boolean;
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  if (videos.length === 0) {
    // Placeholder shown while no videos have been added yet
    return (
      <div className="mb-16 p-12 bg-muted/50 rounded-2xl border-2 border-dashed border-border text-center">
        <Play className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          {isRTL
            ? "لا تكتفِ بسماع قصتنا، بل شاهد أعمالنا المميزة في هذا المجال"
            : "Don't just hear our story — watch our work in action"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {isRTL ? "(سيتم إضافة الفيديوهات قريباً)" : "(Videos coming soon)"}
        </p>
      </div>
    );
  }

  return (
    <>
      <Swiper
        key={isRTL ? "rtl" : "ltr"}
        dir={isRTL ? "rtl" : "ltr"}
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2.5 },
        }}
        className="portfolio-swiper !pb-12 mb-16">
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div
              className="relative group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border aspect-video"
              onClick={() => setActiveVideo(video)}>
              {/* Thumbnail for YouTube */}
              {video.type === "youtube" && (
                <img
                  src={`https://img.youtube.com/vi/${video.src}/hqdefault.jpg`}
                  alt={video.title}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-7 h-7 text-white fill-white ms-1" />
                </div>
                <p className="text-white font-medium text-sm px-4 text-center drop-shadow">
                  {video.title}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Video Lightbox / Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setActiveVideo(null)}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X className="w-8 h-8 text-white" />
            </button>

            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-4xl aspect-video">
              (
              <iframe
                src={getEmbedSrc(activeVideo)}
                title={activeVideo.title}
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              )
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default VideoCarouselSection;
