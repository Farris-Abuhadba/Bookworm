import { TextInput } from "@mantine/core";
import { BiSearchAlt2, BiSolidSearchAlt2 } from "react-icons/bi";

interface SearchBarProps {
  searchValue: string;
  setSearchValue(newValue: string): void;
  handleSearch(): void;
}

const SearchBar = ({
  searchValue,
  setSearchValue,
  handleSearch,
}: SearchBarProps) => {
  return (
    <div className="bg-zinc-800 border border-zinc-600 sm:rounded-md flex items-center">
      <TextInput
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleSearch();
        }}
        placeholder="Search for novels"
        variant="unstyled"
        className="grow ps-1"
      />

      <div
        title="Search"
        className={
          "w-[36px] h-[36px] flex justify-center items-center border-zinc-600 fade" +
          (searchValue.length > 2
            ? " text-zinc-400 hover:text-lavender-600 fade cursor-pointer"
            : " text-zinc-600")
        }
        onClick={handleSearch}
      >
        {(searchValue.length < 3 && <BiSearchAlt2 size={24} />) || (
          <BiSolidSearchAlt2 size={24} />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
