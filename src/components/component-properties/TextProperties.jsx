import {
  AlignmentProperty,
  ColorProperty,
  SelectProperty,
  TextAreaProperty,
} from "@/components/properties";
import { FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from "@/constants/propertyOptions";

const TextProperties = ({ selectedComponent, updateAttribute, updateContent }) => {
  return (
    <>
      <TextAreaProperty
        label="Text Content"
        value={selectedComponent.content || ""}
        onChange={updateContent}
      />
      <AlignmentProperty
        label="Text Alignment"
        value={selectedComponent.attributes.align || "left"}
        onChange={value => updateAttribute("align", value)}
        type="horizontal"
      />
      <ColorProperty
        label="Color"
        value={selectedComponent.attributes.color}
        onChange={value => updateAttribute("color", value)}
        defaultColor="#000000"
      />
      <SelectProperty
        label="Font Size"
        value={selectedComponent.attributes["font-size"] || "16px"}
        onChange={value => updateAttribute("font-size", value)}
        options={FONT_SIZE_OPTIONS}
      />
      <SelectProperty
        label="Font Family"
        value={selectedComponent.attributes["font-family"] || "Arial, sans-serif"}
        onChange={value => updateAttribute("font-family", value)}
        options={FONT_FAMILY_OPTIONS}
      />
    </>
  );
};

export default TextProperties; 