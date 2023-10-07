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
        className="rounded-md mb-2 group-hover:outline-lavender-600 outline-transparent outline outline-offset-2 fade"
        alt={title}
        src={image}
        radius={6}
        withPlaceholder
      />
      <Text className="mt-1 px-1 rounded-md transparent-button-hover">
        {title}
      </Text>
    </div>
  );
};

export default NovelCard;
