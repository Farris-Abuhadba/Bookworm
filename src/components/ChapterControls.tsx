import { Chapter } from "../types/Novel";
import { ActionIcon, Button } from "@mantine/core";
import { BiSolidChevronLeft, BiSolidChevronRight } from "react-icons/bi";
import { useState } from "react";
import { Combobox, InputBase, useCombobox } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";

interface ChapterControlsProps {
  className?: string;

  novelId: string;
  chapters: Chapter[];
  current: Chapter;
}

const ChapterControls = ({
  novelId,
  chapters,
  current,
  className = "",
}: ChapterControlsProps) => {
  var currentChapterIndex = chapters.findIndex((c) => c.id == current.id);

  const router = useRouter();
  const [value, setValue] = useState<Chapter>(chapters[currentChapterIndex]);

  const prevChapter =
    currentChapterIndex - 1 >= 0 && chapters[currentChapterIndex - 1].id;
  const nextChapter =
    currentChapterIndex + 1 < chapters.length &&
    chapters[currentChapterIndex + 1].id;

  return (
    <div className={"flex space-x-1 items-center " + className}>
      <ActionIcon
        title="Previous Chapter"
        variant="default"
        onClick={() => {
          setValue(chapters[currentChapterIndex - 1]);
          router.push(`/novel/${novelId}/${prevChapter}`);
        }}
        disabled={currentChapterIndex - 1 < 0}
        w={36}
        h={36}
      >
        <BiSolidChevronLeft />
      </ActionIcon>

      <ChapterDropdownSearch
        novelId={novelId}
        chapters={chapters}
        current={current}
        router={router}
        value={value}
        setValue={setValue}
      />

      <ActionIcon
        title="Next Chapter"
        variant="default"
        onClick={() => {
          setValue(chapters[currentChapterIndex + 1]);
          router.push(`/novel/${novelId}/${nextChapter}`);
        }}
        disabled={currentChapterIndex + 1 >= chapters.length}
        w={36}
        h={36}
      >
        <BiSolidChevronRight />
      </ActionIcon>
    </div>
  );
};

interface ChapterDropdownSearchProps {
  novelId: string;
  chapters: Chapter[];
  current: Chapter;

  router: NextRouter;
  value: Chapter;
  setValue: (value: Chapter) => void;
}

const ChapterDropdownSearch = ({
  novelId,
  chapters,
  router,
  value,
  setValue,
}: ChapterDropdownSearchProps) => {
  function getFilteredOptions(
    data: Chapter[],
    searchQuery: string,
    value: Chapter,
    limit: number
  ) {
    const result: Chapter[] = [];

    if (searchQuery == "") {
      let currentIndex = chapters.findIndex((c) => c.id == value.id);
      for (let i = currentIndex - 1; i < data.length; i++) {
        if (i < 0) continue;
        if (result.length >= limit) break;

        result.push(data[i]);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (result.length >= limit) {
          break;
        }

        if (
          data[i].title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        ) {
          result.push(data[i]);
        }
      }
    }

    return result;
  }

  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const filteredOptions = getFilteredOptions(chapters, search, value, 11);
  const options = filteredOptions
    .filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((item) => {
      const selected = value.id == item.id;
      return (
        <Combobox.Option
          value={item.id}
          key={item.id}
          className={
            selected
              ? "flex items-center space-x-2 text-accent-300 font-bold"
              : ""
          }
        >
          {selected && <BiSolidChevronRight className="shrink-0" size={16} />}
          <span>{item.title}</span>
        </Combobox.Option>
      );
    });

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        const chapter = chapters.find((c) => c.id == val);
        setValue(chapter);
        combobox.closeDropdown();

        router.push(`/novel/${novelId}/${chapter.id}`);
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          className="line-clamp-1 w-full"
        >
          {value.title}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search Chapters"
        />
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>No chapters found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default ChapterControls;
