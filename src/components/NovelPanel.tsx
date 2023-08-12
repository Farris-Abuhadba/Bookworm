import {
  Button,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ReactNode } from "react";
import {
  TiArrowBack,
  TiBook,
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";
import { Novel } from "../types/Novel";

interface Props {
  novel: Novel;
}

const NovelPanel = ({ novel }: Props) => {
  return (
    <>
      <TiArrowBack
        className="cursor-pointer hover:text-sky-600"
        size={24}
        onClick={() => {
          location.href = "/novel-list";
        }}
      />
      <Group className="bg-stone-950 rounded-md p-4">
        <Image
          className="m-2 rounded-md border border-neutral-500"
          src={novel.cover}
          height={300}
          width={225}
          radius="md"
          withPlaceholder
        />
        <div className="m-2">
          <Title size="38px">{novel.title}</Title>
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
              <TiBook className="me-2" /> {novel.chapter_count}
            </NovelStat>
            {/* <BookStat title="Views">
                        <BsEye className="me-2" /> {viewsToString(book.views)}
                    </BookStat> */}
            <NovelStat title="Rating">
              <RatingStars rating={novel.rating} /> {novel.rating}
            </NovelStat>
            <NovelStat title="Status" children={novel.status} />
          </Group>

          <Group my="1rem" spacing={1}>
            {novel.genres.map((item) => (
              <GenreTag key={item} genre={item} />
            ))}
          </Group>

          <Button className="me-2 bg-sky-600">Read</Button>
          {/* <Button
                    className="border-neutral-400 text-neutral-400 hover:bg-neutral-400/25"
                    variant="outline"
                >
                    Chapter List
                </Button> */}
        </div>
      </Group>
    </>
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
        return <TiStarFullOutline key={"filledStar" + index} />;
      })}
      {Math.round(rating) > Math.floor(rating) && <TiStarHalfOutline />}
      {emptyStars.map((_item, index) => {
        return <TiStarOutline key={"emptyStar" + index} />;
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
