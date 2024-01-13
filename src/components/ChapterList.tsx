import { Button, Pagination, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import RelativeTime from "@yaireo/relative-time";
import Link from "next/link";
import { useState } from "react";
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiLeftArrowAlt,
  BiRightArrowAlt,
  BiSearchAlt2,
  BiX,
} from "react-icons/bi";
import { PiSortAscending, PiSortDescending } from "react-icons/pi";
import { Chapter } from "../types/Novel";

interface Props {
  chapters: Chapter[];
}

const CHAPTERS_PER_PAGE = 50;
const ChapterList = ({ chapters }: Props) => {
  const [page, setPage] = useState<number>(1);
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, cancelSearch] = useDebouncedValue(search, 1000);

  let visibleChapters = chapters.slice(0);
  for (let i = 0; i < visibleChapters.length; i++) {
    if (
      search != "" &&
      debouncedSearch != "" &&
      !visibleChapters[i].title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    ) {
      visibleChapters.splice(i, 1);
      i--;
    }
  }

  let pages = visibleChapters.length / CHAPTERS_PER_PAGE;
  if (visibleChapters.length % CHAPTERS_PER_PAGE > 0) pages++;

  let visibleStartIndex = (page - 1) * CHAPTERS_PER_PAGE;
  if (!sortAscending) visibleChapters = visibleChapters.toReversed();
  visibleChapters = visibleChapters.slice(
    visibleStartIndex,
    visibleStartIndex + CHAPTERS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <TextInput
          className="grow"
          placeholder="Search chapters by title or number"
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
          }}
          leftSection={<BiSearchAlt2 />}
          rightSection={
            search == "" || (
              <BiX
                onClick={() => {
                  cancelSearch();
                  setSearch("");
                }}
              />
            )
          }
        />

        <Button
          title={"Sort " + (sortAscending ? "Ascending" : "Descending")}
          variant="default"
          className="w-8 h-8 p-0 shrink-0"
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
          firstIcon={BiArrowToLeft}
          lastIcon={BiArrowToRight}
          boundaries={0}
          gap={4}
          withEdges
        />
      </div>
      <div id="chapter-list" className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {visibleChapters.map((chapter, index) => (
          <ChapterRow key={index} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default ChapterList;

interface ChapterRowProps {
  chapter: Chapter;
}

const ChapterRow = ({ chapter }: ChapterRowProps) => {
  let releaseDate = new Date(chapter.timestamp * 1000);

  return (
    <Link
      href={location.href + "/" + chapter.id}
      className="group bg-primary-600 hover:bg-primary-400 hover:scale-[1.01] rounded-sm p-1 fade"
    >
      <div className="flex justify-between">
        <span
          className="group-hover:text-accent-300 truncate fade"
          title={chapter.title}
        >
          {chapter.title}
        </span>
        <span className="font-bold ms-2 text-secondary-700">
          {chapter.index}
        </span>
      </div>
      <span
        className="text-secondary-600"
        title={`${releaseDate.toLocaleDateString()} ${releaseDate.toLocaleTimeString()}`}
      >
        {new RelativeTime().from(releaseDate)}
      </span>
    </Link>
  );
};
