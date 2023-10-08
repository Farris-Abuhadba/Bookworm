import Link from "next/link";
import { Chapter } from "../types/Novel";

interface Props {
  chapters: Chapter[];
}

const ChapterList = ({ chapters }: Props) => {
  return (
    <div id="chapter-list" className="panel space-y-1">
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
