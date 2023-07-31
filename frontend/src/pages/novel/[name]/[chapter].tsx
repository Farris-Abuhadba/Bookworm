import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

export default function ChapterContent() {
    const router = useRouter();
    const { name, chapter } = router.query;

    const { data: chapterContent, isLoading } = useQuery(
        ["chapters"],
        async () => {
            return axios.get(`http://localhost:8000/${name}/${chapter}`);
        },
        { enabled: Boolean(router.isReady), refetchOnWindowFocus: false }
    );

    return <>{(!isLoading && <div>{chapterContent.data}</div>) || <div>Loading....</div>}</>;
}
