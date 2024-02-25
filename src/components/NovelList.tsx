import { Image } from "@mantine/core";
import Link from "next/link";
import { Novel } from "../types/Novel";
import RelativeTime from "@yaireo/relative-time";

interface Props {
  title: string;
  novels: Novel[];
}

const NovelList = ({ title, novels }: Props) => {
  novels.splice(12);

  return (
    <div className="space-y-3 px-2">
      <span className="font-medium text-2xl">{title}</span>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-1 gap-x-3">
        {novels.map((novel, index) => {
          let chapter = novel.chapters.slice(-1)[0];

          return (
            <Link
              key={index}
              className={
                "bg-primary-500 h-[90px] overflow-clip rounded" +
                (index > 5 ? " hidden md:flex" : " flex")
              }
              href={"/novel/" + novel.id}
            >
              <Image w={64} h={90} src={novel.image} alt="" />
              <div className="w-full p-2 flex flex-col justify-between">
                <span className="line-clamp-2 text-secondary-100">
                  {novel.title}
                </span>
                {chapter && (
                  <div className="flex space-x-3 text-secondary-500">
                    <span className="shrink grow-0 line-clamp-1">
                      {chapter.title}
                    </span>
                    <span className="grow shrink-0 text-right">
                      {new RelativeTime().from(new Date(chapter.timestamp))}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NovelList;
