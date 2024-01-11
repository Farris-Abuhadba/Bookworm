import { ActionIcon } from "@mantine/core";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import "swiper/css";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Novel } from "../types/Novel";
import NovelCard from "./NovelCard";

interface Props {
  title: string;
  novels: Novel[];
  fullPageUrl?: string;
}

const NovelCarousel = ({ title, novels, fullPageUrl }: Props) => {
  return (
    <div className="space-y-3">
      <div className="px-2 flex justify-between">
        <span className="font-medium text-2xl">{title}</span>
        {fullPageUrl && (
          <Link href={fullPageUrl}>
            <ActionIcon variant="default" radius="full">
              <BiRightArrowAlt size={32} />
            </ActionIcon>
          </Link>
        )}
      </div>
      <Swiper
        slidesPerView="auto"
        scrollbar={{ draggable: true, hide: true }}
        freeMode={{ sticky: true }}
        className="!pb-4 group/swiper"
      >
        {novels.map((novel, index) => {
          return (
            <SwiperSlide key={"slide_" + index} className="!w-[144px] px-2">
              <NovelCard novel={novel} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default NovelCarousel;
