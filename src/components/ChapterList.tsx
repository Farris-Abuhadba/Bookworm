import Link from "next/link";
import { Chapter } from "../types/Novel";
import { Button, Pagination, TextInput } from "@mantine/core";
import { useState } from "react";
import {
  BiLeftArrowAlt,
  BiListUl,
  BiRightArrowAlt,
  BiDotsHorizontalRounded,
  BiSearchAlt2,
} from "react-icons/bi";
import { PiSortAscending, PiSortDescending } from "react-icons/pi";

interface Props {
  chapters: Chapter[];
}

const CHAPTERS_PER_PAGE = 15;
const ChapterList = ({ chapters }: Props) => {
  const [page, setPage] = useState<number>(1);
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  let pages = chapters.length / CHAPTERS_PER_PAGE;
  if (chapters.length % CHAPTERS_PER_PAGE > 0) pages++;

  if (!sortAscending) chapters = chapters.toReversed();
  chapters = chapters.slice(
    (page - 1) * CHAPTERS_PER_PAGE,
    (page - 1) * CHAPTERS_PER_PAGE + CHAPTERS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-4">
        <div className="flex space-x-2">
          <TextInput w={280} placeholder="Search Chapter Title or Number" />
          <Button className="w-9 h-9 p-0">
            <BiSearchAlt2 />
          </Button>
        </div>

        <div className="flex space-x-4 items-center">
          <Button
            title={"Sort " + (sortAscending ? "Ascending" : "Descending")}
            variant="default"
            className="w-8 h-8 p-0"
            onClick={() => {
              setSortAscending(!sortAscending);
              setPage(1);
            }}
          >
            {(sortAscending && <PiSortAscending />) || <PiSortDescending />}
          </Button>
          <Pagination
            value={page}
            onChange={setPage}
            total={pages}
            previousIcon={BiLeftArrowAlt}
            nextIcon={BiRightArrowAlt}
            dotsIcon={BiDotsHorizontalRounded}
          />
        </div>
      </div>
      <div
        id="chapter-list"
        className="space-y-1 border-t border-secondary-600"
      >
        {chapters.map((chapter, index) => (
          <ChapterRow key={index} index={index + 1} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default ChapterList;

interface ChapterRowProps {
  index: number;
  chapter: Chapter;
}

const ChapterRow = ({ index, chapter }: ChapterRowProps) => {
  return (
    <Link
      href={location.href + "/" + chapter.id}
      className={
        "group border border-transparent hover:border-lavender-600 p-1 rounded-md flex fade" +
        (index % 2 == 0 ? " bg-zinc-900" : "")
      }
      title={chapter.title}
    >
      <span className="grow group-hover:text-lavender-600 truncate fade">
        {chapter.title}
      </span>
      <span className="font-bold ms-2 text-zinc-500">{index}</span>
    </Link>
  );
};
