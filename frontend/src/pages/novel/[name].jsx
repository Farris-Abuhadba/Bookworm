import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

export default function LightNovels() {
  const router = useRouter();
  const novelName = router.query
  const cleanedNovelName = novelName.name?.substring( 0, novelName.name?.lastIndexOf( "-novel" ) );

  const { data: chaptersList, isLoading } = useQuery(
    ["novel-chapters"],
    async () => {
      return axios
      .get(`http://localhost:8000/light-novel/${cleanedNovelName}`)
    },
    {enabled: Boolean(router.isReady), refetchOnWindowFocus: false}
  )
  console.log(novelName)

  return (
    <div className='bg-purple-800 h-screen'>
      <h1>Chapter List for {cleanedNovelName}</h1>
      <div>
      {isLoading ? (<div>Loading....</div>) : (<div>{chaptersList.data.map((chapterTitle, index) => {
          const cleanChapterTitle = chapterTitle.substring(chapterTitle.lastIndexOf('/') + 1);
          return (
            <div key={index}>
              <Link href={{pathname:`/novel/${cleanedNovelName}/${cleanChapterTitle}`, query: {name: cleanedNovelName, chapter: cleanChapterTitle}}}>
                <div className='bg-white-500 hover:bg-gray-100 hover:text-black'>
                  {cleanChapterTitle}
                </div>
              </Link>
            </div>
          );
        })}
        </div>)
      }
        
      </div>
    </div>
  );
}
