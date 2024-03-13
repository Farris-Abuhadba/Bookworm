import { useState } from "react";
import {
  Checkbox,
  CloseButton,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  useCombobox,
} from "@mantine/core";
import { BiX } from "react-icons/bi";

const MAX_DISPLAYED_VALUES = 2;

interface Props {
  items: string[];
}

const FilterTernaryMultiselect = ({ items }: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [include, setInclude] = useState<string[]>([]);
  const [exclude, setExclude] = useState<string[]>([]);

  const handleValueSelect = (val: string) => {
    if (include.includes(val)) {
      setInclude((current) => current.filter((v) => v != val));
      setExclude((current) => [...current, val]);
    } else if (exclude.includes(val)) {
      setExclude((current) => current.filter((v) => v != val));
    } else {
      setInclude((current) => [...current, val]);
    }
  };

  const handleValueRemove = (val: string) => {
    if (include.includes(val))
      setInclude((current) => current.filter((v) => v != val));
    if (exclude.includes(val))
      setInclude((current) => current.filter((v) => v != val));
  };

  let combined = [...include, ...exclude];
  const values = combined
    .slice(
      0,
      MAX_DISPLAYED_VALUES === combined.length
        ? MAX_DISPLAYED_VALUES
        : MAX_DISPLAYED_VALUES - 1
    )
    .map((item) => (
      <Pill
        key={item}
        withRemoveButton
        onRemove={() => handleValueRemove(item)}
      >
        {item}
      </Pill>
    ));

  const options = items.map((item) => {
    const state = include.includes(item) ? 1 : exclude.includes(item) ? -1 : 0;

    return (
      <Combobox.Option value={item} key={item} active={state != 0}>
        <Group gap="sm">
          <Checkbox
            onChange={() => {}}
            checked={state != 0}
            indeterminate={state == -1}
            color={state == -1 ? "red" : ""}
            aria-hidden
            tabIndex={-1}
            style={{ pointerEvents: "none" }}
          />
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    );
  });

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          pointer
          onClick={() => combobox.toggleDropdown()}
          rightSection={
            combined.length > 0 ? (
              <CloseButton
                size="sm"
                onClick={() => {
                  setInclude([]);
                  setExclude([]);
                }}
                title="Clear all"
                aria-label="Clear all"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
        >
          <Pill.Group>
            {values.length > 0 ? (
              <>
                {values}
                {combined.length > MAX_DISPLAYED_VALUES && (
                  <Pill>
                    +{combined.length - (MAX_DISPLAYED_VALUES - 1)} more
                  </Pill>
                )}
              </>
            ) : (
              <Input.Placeholder>Pick one or more values</Input.Placeholder>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default FilterTernaryMultiselect;
