import { ColorProperty, SelectProperty } from "@/components/properties";
import { BORDER_WIDTH_OPTIONS } from "@/constants/propertyOptions";

const DividerProperties = ({ selectedComponent, updateAttribute }) => {
  return (
    <>
      <ColorProperty
        label="Color"
        value={selectedComponent.attributes["border-color"]}
        onChange={value => updateAttribute("border-color", value)}
        defaultColor="#CCCCCC"
      />
      <SelectProperty
        label="Width"
        value={selectedComponent.attributes["border-width"] || "1px"}
        onChange={value => updateAttribute("border-width", value)}
        options={BORDER_WIDTH_OPTIONS}
      />
    </>
  );
};

export default DividerProperties; 