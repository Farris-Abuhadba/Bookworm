import { Image, Text } from "@mantine/core";

interface Props {
  title: string;
  image: string;
  width?: number;
  height?: number;
}

const NovelCard = ({ title, image, width, height }: Props) => {
  return (
    <div className={"rounded-md relative"}>
      <Image
        alt={title}
        src={image}
        width={width ? width : 200}
        height={height ? height : 300}
        radius={6}
        withPlaceholder
      />
      <Text className="rounded-b-md border-t-2 border-neutral-500 text-center absolute bottom-0 w-full p-1 bg-neutral-950">
        {title}
      </Text>
    </div>
  );
};

export default NovelCard;
