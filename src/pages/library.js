import { useEffect, useState } from "react";

const LibraryPage = () => {
  const [novelLibrary, setNovelLibrary] = useState([]);

  useEffect(() => {
    let novels = JSON.parse(localStorage.getItem("novelLibrary")) || [];
    setNovelLibrary(novels);
  }, []);

  return (
    <div className="sm:max-w-2/5 sm:w-3/5 sm:my-5 mx-auto p-4 rounded-md bg-neutral-800">
      {novelLibrary.map((novelId) => {
        return <div>{novelId}</div>;
      })}
    </div>
  );
};

export default LibraryPage;
