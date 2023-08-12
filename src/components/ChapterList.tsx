import RelativeTime from "@yaireo/relative-time";
import { Chapter } from "../types/Novel";

interface Props {
  chapters: Chapter[];
}

const ChapterList = ({ chapters }: Props) => {
  return (
    <div id="chapter-list" className="p-4 mb-2 rounded-md bg-stone-950">
      {/* <Title align="center" size="24px">
                Chapter List
            </Title>
            <Divider className="my-4" size="md" /> */}
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
    <div key={chapter.title} className="flex">
      <span className="font-bold w-16 text-neutral-400/50">{index}</span>
      <a
        className="grow underline text-neutral-400 hover:text-neutral-200"
        href={location.href + "/" + chapter.id}
      >
        {chapter.title}
      </a>
      {/* <span className="text-right text-neutral-400/50">
                {new RelativeTime().from(new Date(chapter.timestamp))}
            </span> */}
    </div>
  );
};
