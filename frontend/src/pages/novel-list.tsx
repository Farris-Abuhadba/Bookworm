import { Image, Loader, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function NovelList() {
    const { data: response, isLoading } = useQuery(["hot-novels"], async () => {
        return axios.get("http://localhost:8000/hot-novels?topicId=index-novel-hot");
    });

    return (
        <>
            {(isLoading && (
                <div className="flex h-screen">
                    <Loader className="m-auto" size="xl" />
                </div>
            )) || (
                <div className="max-w-2/5 w-3/5 m-5 mx-auto p-4 rounded-md bg-neutral-800">
                    <Title className="mb-4 -m-4 p-4 rounded-t-md bg-neutral-950" size="38px">
                        Featured
                    </Title>
                    <div className="flex flex-wrap justify-center">
                        {response.data.map((novel, index) => {
                            const novelSlug = novel.url.split("/").pop();
                            return (
                                <Link
                                    key={index}
                                    href={{ pathname: `/novel/${novelSlug}`, query: novelSlug }}
                                    className="m-1"
                                >
                                    <BookCard title={novel.title} image={novel.cover} />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

interface BookCardProps {
    title: string;
    image: string;
}

const BookCard = ({ title, image }: BookCardProps) => {
    return (
        // <Card className="rounded-md" w={150} h={200} padding={4} withBorder>
        //     <Card.Section>
        //         <Image src={image} fit="contain" withPlaceholder />
        //     </Card.Section>

        //     <Text align="center">{title}</Text>
        // </Card>
        <div className="rounded-md border-neutral-500 relative">
            <Image src={image} width={200} height={300} radius={6} withPlaceholder />
            <Text className="rounded-b-md border-t-2 border-neutral-500 text-center absolute bottom-0 w-full p-1 bg-neutral-950">
                {title}
            </Text>
        </div>
    );
};
