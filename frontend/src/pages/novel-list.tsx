import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export default function NovelList() {
    const { data: hotNovelsList, isLoading } = useQuery(["hot-novels"], async () => {
        return axios.get("http://localhost:8000/hot-novels?topicId=index-novel-hot");
    });

    return (
        <div className="bg-purple-800 h-screen">
            <h1>Novel List Page</h1>
            {(!isLoading && (
                <div>
                    {hotNovelsList.data.map((hotNovel, index) => {
                        const novelSlug = hotNovel.split("/").pop();
                        return (
                            <div key={index}>
                                <Link href={{ pathname: `/novel/${novelSlug}`, query: novelSlug }}>
                                    <div className="bg-white-500 hover:bg-gray-100 hover:text-black">
                                        {novelSlug}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )) || <div>Loading....</div>}
        </div>
    );
}
