import {
  Button,
  Divider,
  Group,
  Image,
  Stack,
  Text,
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
    <div className="sm:flex bg-stone-950 sm:rounded-md p-4">
      <div className="relative w-fit h-fit my-2 mx-auto sm:mx-2 rounded-md border border-neutral-800">
        <Image
          className="absolute blur-xl opacity-70"
          alt="Book Cover"
          src={novel.cover}
          height={300}
          width={225}
        />
        <Image
          className="z-10"
          alt="Book Cover"
          src={novel.cover}
          height={300}
          width={225}
          radius="md"
          withPlaceholder
        />
      </div>
      <div className="m-2">
        <Title size="38px" className="text-center sm:text-left">
          {novel.title}
        </Title>
        <div>
          <span>
            By{" "}
            <Text
              td="underline"
              className="text-sky-600"
              component="a"
              href="/"
            >
              {novel.author}
            </Text>
          </span>
        </div>

        <Group my="1rem" spacing="md">
          <NovelStat title="Chapters">
            <BiSolidBook className="me-2" /> {novel.chapter_count}
          </NovelStat>
          <NovelStat title="Rating">
            <RatingStars rating={novel.rating} /> {novel.rating}
          </NovelStat>
          <NovelStat title="Status">{novel.status}</NovelStat>
        </Group>

        <Group my="1rem" spacing={1}>
          {novel.genres.map((item) => (
            <GenreTag key={item} genre={item} />
          ))}
        </Group>

        <Button
          className="me-2 bg-sky-600"
          onClick={() => {
            location.href += "/" + lastRead;
          }}
        >
          Read
        </Button>

        {(inLibrary && (
          <Button
            variant="outline"
            color="gray"
            onClick={() => {
              removeFromLibrary(novel.id);
              setInLibrary(isInLibrary(novel.id));
            }}
          >
            Remove from Library
          </Button>
        )) || (
          <Button
            className="border border-sky-600 text-sky-600 hover:bg-sky-600/10"
            onClick={() => {
              addToLibrary(novel.id);
              setInLibrary(isInLibrary(novel.id));
            }}
          >
            Add to Library
          </Button>
        )}
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
    if (children == "On Going") statusColor = "text-green-500";
    else if (children == "Completed") statusColor = "text-sky-500";
    else if (children == "Hiatus") statusColor = "text-yellow-500";
    else if (children == "Dropped") statusColor = "text-red-500";
    else statusColor = "text-red-500";
  }

  return (
    <>
      <Stack spacing="xs">
        <small className="-mb-3">{title}</small>
        {(title === "Status" && (
          <h5 className={statusColor}>{children}</h5>
        )) || <h5 className="flex items-center">{children}</h5>}
      </Stack>
      {title !== "Status" && (
        <Divider my="auto" h={32} orientation="vertical" />
      )}
    </>
  );
};

interface GenreTagProps {
  genre: string;
}

const GenreTag = ({ genre }: GenreTagProps) => {
  return (
    <Button
      className="me-1 rounded-full text-sky-600 bg-sky-600/25 hover:bg-sky-600/25 hover:border-sky-600"
      compact
    >
      {genre}
    </Button>
  );
};

interface RatingStarsProps {
  rating: number;
}

const RatingStars = ({ rating }: RatingStarsProps) => {
  let filledStars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    filledStars.push(0);
  }

  let emptyStars = [];
  for (let i = Math.round(rating); i < 5; i++) {
    emptyStars.push(0);
  }

  return (
    <div className="flex me-2">
      {filledStars.map((_item, index) => {
        return <BiSolidStar key={"filledStar" + index} />;
      })}
      {Math.round(rating) > Math.floor(rating) && <BiSolidStarHalf />}
      {emptyStars.map((_item, index) => {
        return <BiStar key={"emptyStar" + index} />;
      })}
    </div>
  );
};

function viewsToString(views: number) {
  const L = ["B", "M", "K"];
  let l = 0;
  for (let i = 1000000000; i >= 1000; i /= 1000) {
    if (views >= i) return Math.round(views / (i / 10)) / 10 + L[l];
    l++;
  }
  return views;
}
