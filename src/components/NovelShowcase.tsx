import { useEffect } from "react";
import { useQuery } from "react-query";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, FreeMode, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Novel } from "../types/Novel";
import ErrorScreen from "./ErrorScreen";
import LoadingScreen from "./LoadingScreen";
import { NovelCardDetailed } from "./NovelCard";
import NovelCarousel from "./NovelCarousel";
import NovelList from "./NovelList";

SwiperCore.use([Autoplay, FreeMode, Pagination, Scrollbar]);

export default function NovelShowcase() {
  const { data, isError, isLoading } = useQuery(
    "novels",
    async () => {
      const response = await fetch("/api/novels");
      const data = await response.json();
      return data;
    },
    { staleTime: 900000 }
  );

  if (isLoading) return <LoadingScreen />;
  if (isError || !data.success)
    return <ErrorScreen title="API Error">{data.error}</ErrorScreen>;

  const novels = data["data"] as { [category: string]: Novel[] };

  return (
    <div className="panel space-y-8">
      <Swiper
        slidesPerView={1}
        breakpoints={{ 1024: { slidesPerView: 2 }, 1536: { slidesPerView: 3 } }}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 10000, pauseOnMouseEnter: true }}
        className="!pb-8"
      >
        {novels["popular"].map((novel, index) => {
          return (
            <SwiperSlide key={"slide_" + index} className="px-2">
              <NovelCardDetailed novel={novel} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <NovelCarousel title="Trending" novels={novels["trending"]} />
      <NovelList title="Lastest Updates" novels={novels["latest"]} />
      <NovelCarousel title="New Releases" novels={novels["new"]} />
    </div>
  );
}
