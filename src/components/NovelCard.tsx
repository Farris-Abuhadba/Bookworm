import { Image, Pill } from "@mantine/core";
import Link from "next/link";
import { Novel } from "../types/Novel";

interface Props {
  novel: Novel;
}

export const NovelCard = ({ novel }: Props) => {
  return (
    <Link className="group select-none space-y-1" href={"/novel/" + novel.id}>
      <div className="w-fit overflow-hidden rounded">
        <Image
          className="fade group-hover:scale-110"
          w={128}
          h={180}
          src={novel.image}
        />
      </div>
      <span
        title={novel.title}
        className="line-clamp-2 group-hover:text-accent-300 fade"
      >
        {novel.title}
      </span>
    </Link>
  );
};

export const NovelCardDetailed = ({ novel }: Props) => {
  return (
    <Link
      className="flex justify-between h-[180px] group rounded overflow-clip relative bg-primary-500 fade"
      href={"/novel/" + novel.id}
    >
      <div className="z-10 p-2 w-full m-2 flex flex-col justify-between bg-primary-500/75 rounded">
        <p className="group-hover:text-accent-300 line-clamp-2 text-secondary-200 fade">
          {novel.title}
        </p>
        <p className="text-sm line-clamp-2 sm:line-clamp-3 text-secondary-500">
          {novel.description}
        </p>
        <div className="space-x-1 space-y-1">
          {novel.genres?.map((genre, index) => {
            if (index > 2) return;
            return <Pill key={genre}>{genre}</Pill>;
          })}
        </div>
      </div>
      <Image
        className="fade z-10 scale-125 rotate-[16deg] translate-x-5 translate-y-2 group-hover:transform-none group-hover:opacity-100 opacity-60"
        w={128}
        h={180}
        src={novel.image}
      />

      <Image
        className="absolute blur-xl saturate-[180%] fade group-hover:opacity-75 opacity-0"
        w={375}
        h={180}
        src={novel.image}
      />
    </Link>
  );
};

export default NovelCard;
