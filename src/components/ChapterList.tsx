import Link from "next/link";
import { Chapter } from "../types/Novel";

interface Props {
  chapters: Chapter[];
}

const ChapterList = ({ chapters }: Props) => {
  return (
    <div id="chapter-list" className="p-4 mb-2 sm:rounded-md bg-stone-950">
      {chapters.map((chapter, index) => (
        <ChapterRow key={index} index={index + 1} chapter={chapter} />
      ))}
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
        "group outline outline-0 hover:outline-1 outline-neutral-700 p-1 m-1 rounded-md flex fade " +
        (index % 2 == 0 && "bg-neutral-900")
      }
    >
      <span className="grow text-neutral-400 group-hover:text-neutral-200 truncate fade">
        {chapter.title}
      </span>
      <span className="font-bold ms-2 text-neutral-400/50">{index}</span>
    </Link>
  );
};
