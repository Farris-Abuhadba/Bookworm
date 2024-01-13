import {
  Button,
  Divider,
  Group,
  Image,
  Pill,
  Rating,
  Stack,
  Title,
} from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import {
  BiSolidBook,
  BiSolidStar,
  BiSolidStarHalf,
  BiStar,
} from "react-icons/bi";
import { addToLibrary, isInLibrary, removeFromLibrary } from "../pages/library";
import { Novel } from "../types/Novel";

interface Props {
  novel: Novel;
}

const NovelPanel = ({ novel }: Props) => {
  const [lastRead, setLastRead] = useState(novel.chapters[0].id);
  const [inLibrary, setInLibrary] = useState(isInLibrary(novel.id));

  useEffect(() => {
    var lastReadChapters = JSON.parse(localStorage.getItem("lastReadChapters"));
    if (lastReadChapters == undefined) lastReadChapters = {};
    var lastReadChapter = lastReadChapters[novel.id];

    if (lastReadChapter == undefined) return;
    else setLastRead(lastReadChapter);
  }, [novel]);

  return (
    <div className="sm:flex space-x-4">
      <div className="relative shrink-0 w-fit h-fit mx-auto sm:mx-0 rounded overflow-clip">
        <Image w={288} h={405} src={novel.image} />
      </div>
      <div className="flex flex-col justify-between my-4">
        <h1
          className="text-4xl line-clamp-5 lg:text-6xl lg:line-clamp-3 font-bold text-center sm:text-left"
          title={novel.title}
        >
          {novel.title}
        </h1>

        <div className="space-y-2">
          <div className="flex justify-center sm:justify-start">
            <span className="shrink-0">By&nbsp;</span>
            <span className="text-accent-300 line-clamp-1" title={novel.author}>
              {novel.author}
            </span>
          </div>

          <div className="flex justify-evenly sm:justify-start sm:space-x-4">
            <NovelStat title="Chapters">
              <BiSolidBook />
              &nbsp;{novel.chapter_count}
            </NovelStat>
            <NovelStat title="Rating">
              <Rating
                value={novel.rating}
                fractions={2}
                emptySymbol={<BiStar />}
                fullSymbol={<BiSolidStar />}
                readOnly
              />
              &nbsp;
              {novel.rating}
            </NovelStat>
            <NovelStat title="Status">{novel.status}</NovelStat>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-1">
            {novel.genres.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>

          <div className="flex justify-center sm:justify-start space-x-2">
            <Button
              className="h-16 w-2/3 sm:w-[auto] sm:h-9"
              onClick={() => {
                location.href += "/" + lastRead;
              }}
            >
              Read
            </Button>

            <Button
              className="h-16 sm:h-9"
              variant="default"
              onClick={() => {
                if (inLibrary) removeFromLibrary(novel.id);
                else addToLibrary(novel.id);

                setInLibrary(isInLibrary(novel.id));
              }}
            >
              {inLibrary ? "Remove from Library" : "Add to Library"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelPanel;

interface NovelStatProps {
  title: string;
  children: ReactNode;
}

const NovelStat = ({ title, children }: NovelStatProps) => {
  var statusColor = "";
  if (title === "Status") {
    if (children == "On Going") statusColor = "text-green-400";
    else if (children == "Completed") statusColor = "text-sky-400";
    else if (children == "Hiatus") statusColor = "text-amber-400";
    else if (children == "Dropped") statusColor = "text-red-400";
    else statusColor = "text-red-500";
  }

  return (
    <>
      <div className="flex flex-col -space-y-1">
        <small>{title}</small>
        {(title === "Status" && (
          <h5 className={statusColor}>{children}</h5>
        )) || <h5 className="flex items-center">{children}</h5>}
      </div>
    </>
  );
};
