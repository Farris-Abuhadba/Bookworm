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
  useEffect(() => {
    getNovels();
  }, []);

  const getNovels = async () => {
    const response = await fetch("/api/hot-novels", {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  };

  const {
    data: novels,
    error,
    isLoading,
  } = useQuery(["hotNovels", getNovels], () => getNovels());

  if (isLoading) return <LoadingScreen />;
  if (error)
    return (
      <ErrorScreen title="API Error">Could not connect to API</ErrorScreen>
    );

  const novelsArray = novels as Novel[];

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
        {novels.map((novel, index) => {
          return (
            <SwiperSlide key={"slide_" + index} className="px-2">
              <NovelCardDetailed novel={novel} />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <NovelCarousel
        title="Trending"
        novels={novelsArray}
        fullPageUrl="/trending"
      />

      <NovelList title="Lastest Updates" novels={novelsArray} />

      <NovelCarousel
        title="New Releases"
        novels={novelsArray}
        fullPageUrl="/completed"
      />
    </div>
  );
}
