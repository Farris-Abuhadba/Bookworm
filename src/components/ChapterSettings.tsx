import { ActionIcon, Button, ComboboxData } from "@mantine/core";
import { useState } from "react";
import { BiReset } from "react-icons/bi";

export interface Setting {
  name: string;
  InputType: any;

  properties: {
    defaultValue: string | number;

    // Select Input
    data?: ComboboxData;
    allowDeselect?: boolean;

    // Number Input
    min?: number;
    max?: number;
    decimalScale?: number;
    fixedDecimalScale?: boolean;
    step?: number;
  };
  state: [any, (value: any) => void];
}

export interface SettingsGroup {
  Icon: any;
  name: string;
  settings: Setting[];

  open?: [boolean, (value: boolean) => void];
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
        return <SettingsGroupButton open={group.open} {...group} />;
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
  function updateValue(name, state, newValue) {
    if (state[0] != newValue) {
      state[1](newValue);
      setSetting(name.toLowerCase().replaceAll(" ", "_"), newValue);
    }
  }

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

      <div className={"p-2 space-y-2 " + (open[0] ? "" : "hidden")}>
        {settings.map((setting) => {
          return (
            <div>
              <div className="flex justify-between">
                <p className="font-medium text-sm">{setting.name}</p>
                <ActionIcon
                  className={
                    setting.state[0] == setting.properties.defaultValue
                      ? "hidden"
                      : ""
                  }
                  title="Reset to default"
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    updateValue(
                      setting.name,
                      setting.state,
                      setting.properties.defaultValue
                    );
                  }}
                >
                  <BiReset />
                </ActionIcon>
              </div>
              <setting.InputType
                value={setting.state[0]}
                {...setting.properties}
                onChange={(newValue) => {
                  updateValue(setting.name, setting.state, newValue);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterSettings;

export const getSetting = (key: string, defaultValue?: any) => {
  var settings = JSON.parse(localStorage.getItem("settings"));
  if (settings == undefined) return defaultValue;

  let storedValue = settings[key];

  if (storedValue == undefined) return defaultValue;

  return storedValue;
};

export const setSetting = (key: string, value: any) => {
  var settings = JSON.parse(localStorage.getItem("settings"));
  if (settings == undefined) settings = {};

  settings[key] = value;
  localStorage.setItem("settings", JSON.stringify(settings));
};
