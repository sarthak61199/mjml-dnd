import { SelectProperty } from "@/components/properties";
import { SPACER_HEIGHT_OPTIONS } from "@/constants/propertyOptions";

const SpacerProperties = ({ selectedComponent, updateAttribute }) => {
  return (
    <SelectProperty
      label="Height"
      value={selectedComponent.attributes.height || "20px"}
      onChange={value => updateAttribute("height", value)}
      options={SPACER_HEIGHT_OPTIONS}
    />
  );
};

export default SpacerProperties; 