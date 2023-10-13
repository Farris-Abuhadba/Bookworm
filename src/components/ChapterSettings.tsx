import { ColorInput, Modal, NumberInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { BiCog } from "react-icons/bi";
import { PiXBold } from "react-icons/pi";

export interface Setting {
  id: string;
  name: string;
  type: "number" | "color";

  defaultValue: any;
  state: [any, (value: any) => void];
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
  properties: Setting[];
}

export const ChapterSettings = ({ properties }: ChapterSettingsProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        padding={0}
        radius={0}
        centered
        withCloseButton={false}
      >
        <SettingsModal closeModal={close} properties={properties} />
      </Modal>

      <div
        className="p-1 rounded-md transparent-button-hover border border-transparent hover:border-lavender-600"
        onClick={open}
      >
        <BiCog title="Settings" size={25} />
      </div>
    </>
  );
};

interface SettingsModalProps extends ChapterSettingsProps {
  closeModal(): void;
}

const SettingsModal = ({ closeModal, properties }: SettingsModalProps) => {
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
        defaultValue={p.state[0]}
        precision={p.precision || 0}
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
        defaultValue={p.state[0]}
        placeholder={p.defaultValue}
        onChangeEnd={onChange}
      />
    </>
  );
};
