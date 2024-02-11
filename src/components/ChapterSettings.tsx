import {
  Button,
  ColorInput,
  Modal,
  NumberInput,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { BiCog } from "react-icons/bi";
import { PiXBold } from "react-icons/pi";

export interface Setting {
  name: string;
  type: "number" | "color" | "select";

  defaultValue: any;
  state: [any, (value: any) => void];
}

export interface SettingsGroup {
  Icon: any;
  name: string;
  settings: Setting[];

  open?: [boolean, (value: boolean) => void];
}

interface SelectSetting extends Setting {
  defaultValue: string;
  options: string[];

  state: [string, (value: string) => void];
}

interface NumberSetting extends Setting {
  defaultValue: number;
  min?: number;
  max?: number;
  precision?: number;
  step?: number;

  state: [number, (value: number) => void];
}

interface ColorSetting extends Setting {
  defaultValue: string;

  state: [string, (value: string) => void];
}

interface ChapterSettingsProps {
  groups: SettingsGroup[];
}

export const ChapterSettings = ({ groups }: ChapterSettingsProps) => {
  for (let i = 0; i < groups.length; i++) {
    groups[i].open = useState<boolean>(false);
  }

  return (
    <>
      {groups.map((group) => {
        return (
          <SettingsGroupButton
            Icon={group.Icon}
            name={group.name}
            settings={group.settings}
            open={group.open}
          />
        );
      })}
    </>
  );
};

interface SettingsGroupButtonProps {
  name: string;
  Icon: any;
  settings: Setting[];
  open: [any, (value: any) => void];
}

const SettingsGroupButton = ({
  name,
  Icon,
  settings,
  open,
}: SettingsGroupButtonProps) => {
  return (
    <div
      className={
        "bg-primary-700 border-primary-400 rounded " +
        (open[0] ? "border-x border-b" : "")
      }
    >
      <Button
        variant="default"
        justify="space-between"
        className="font-normal text-secondary-400"
        fullWidth
        rightSection={<Icon size={24} />}
        onClick={() => {
          open[1](!open[0]);
        }}
      >
        {name}
      </Button>

      <div className={"p-2 space-y-1 " + (open[0] ? "" : "hidden")}>
        <Select
          label="Font Family"
          data={["Arial", "Calibri", "Times New Roman", "Roboto"]}
        />
        <NumberInput label="Font Size" />
        <ColorInput label="Font Color" />
      </div>
    </div>
  );
};

const SettingsModal = ({ closeModal, properties }) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  function updateValue(state, newValue) {
    if (state[0] != newValue) {
      state[1](newValue);
      if (!unsavedChanges) setUnsavedChanges(true);
    }
  }

  return (
    <div className="panel sm:my-0 space-y-4">
      <div className="flex justify-between">
        <span className="font-bold">Chapter Settings</span>
        <div
          className="p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600"
          onClick={closeModal}
        >
          <PiXBold title="Close" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 justify-items-end items-center">
        {properties.map((property) => {
          if (property.type == "number")
            return (
              <SettingInputNumber
                property={property}
                onChange={(newValue) => {
                  updateValue(property.state, newValue);
                }}
              />
            );
          else if (property.type == "color")
            return (
              <SettingInputColor
                property={property}
                onChange={(newValue) => {
                  updateValue(property.state, newValue);
                }}
              />
            );
          else return <></>;
        })}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          className="hover:bg-red-400/25 border border-red-400 text-red-400 fade-custom transition-colors"
          onClick={() => {
            properties.forEach((property) => {
              updateValue(property.state, property.defaultValue);
            });
          }}
        >
          Reset
        </Button>

        <Button
          className="me-2 fade-custom transition-colors bg-lavender-600 hover:bg-lavender-700"
          onClick={() => {
            properties.forEach((property) => {
              setSetting(
                property.name.toLowerCase().replaceAll(" ", ""),
                property.state[0]
              );
            });
            setUnsavedChanges(false);
          }}
          disabled={!unsavedChanges}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ChapterSettings;

interface SettingInputProps {
  property: Setting;
  onChange(value: any): void;
}

const SettingInputNumber = ({ property, onChange }: SettingInputProps) => {
  let p: NumberSetting = property;

  return (
    <>
      <span>{p.name}</span>
      <NumberInput
        value={p.state[0]}
        decimalScale={p.precision || 0}
        fixedDecimalScale={true}
        step={p.step || 1}
        min={p.min || 0}
        max={p.max || 100}
        placeholder={p.defaultValue.toString()}
        onChange={onChange}
      />
    </>
  );
};

const SettingInputColor = ({ property, onChange }: SettingInputProps) => {
  let p: ColorSetting = property;

  return (
    <>
      <span>{p.name}</span>
      <ColorInput
        value={p.state[0]}
        placeholder={p.defaultValue}
        onChangeEnd={onChange}
      />
    </>
  );
};

export const getSetting = (key: string, defaultValue?: any) => {
  var settings = JSON.parse(localStorage.getItem("settings"));
  if (settings == undefined) return defaultValue;

  let storedValue = settings[key];

  if (storedValue == undefined) return defaultValue;

  return storedValue;
};

const setSetting = (key: string, value: any) => {
  var settings = JSON.parse(localStorage.getItem("settings"));
  if (settings == undefined) settings = {};

  settings[key] = value;
  localStorage.setItem("settings", JSON.stringify(settings));
};
