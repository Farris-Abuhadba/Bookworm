import { Image, Text } from "@mantine/core";

interface Props {
  title: string;
  image: string;
  width?: number;
  height?: number;
}

const NovelCard = ({ title, image, width, height }: Props) => {
  return (
    <div className="group break-inside-avoid-column mb-5">
      <Image
        className="rounded-md group-hover:border-neutral-700 border border-transparent fade"
        alt={title}
        src={image}
        radius={6}
        withPlaceholder
      />
      <Text className="mt-1 px-1 rounded-md group-hover:bg-neutral-700 fade">
        {title}
      </Text>
    </div>
  );
};

export default NovelCard;
