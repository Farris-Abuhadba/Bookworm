import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BackgroundImage, Card, Image, Loader, Text } from "@mantine/core";

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
                <div className="max-w-2/5 w-3/5 mt-5 mx-auto p-4 rounded-md bg-neutral-800">
                    <h1>Featured</h1>
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
        <div className="rounded-md border border-neutral-500 relative">
            <Image src={image} width={200} height={300} radius="sm" withPlaceholder />
            <Text className="rounded-md text-center absolute bottom-0 w-full p-1 bg-neutral-800">
                {title}
            </Text>
        </div>
    );
};
