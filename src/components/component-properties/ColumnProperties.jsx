import { AlignmentProperty, ColorProperty, SelectProperty, TextProperty } from "@/components/properties";
import { COLUMN_WIDTH_OPTIONS } from "@/constants/propertyOptions";

const ColumnProperties = ({ selectedComponent, updateAttribute, handleVerticalAlignChange }) => {
  const currentVerticalAlign = selectedComponent.attributes["vertical-align"] || "top";

  return (
    <>
      <SelectProperty
        label="Width"
        value={selectedComponent.attributes.width || "100%"}
        onChange={value => updateAttribute("width", value)}
        options={COLUMN_WIDTH_OPTIONS}
      />
      <AlignmentProperty
        label="Vertical Alignment"
        value={currentVerticalAlign}
        onChange={handleVerticalAlignChange}
        type="vertical"
        helpText="Applied to all columns in this section"
      />
      <ColorProperty
        label="Background Color"
        value={selectedComponent.attributes["background-color"]}
        onChange={value => updateAttribute("background-color", value)}
        defaultColor="#FFFFFF"
      />
      <TextProperty
        label="Padding"
        value={selectedComponent.attributes.padding || "10px"}
        onChange={value => updateAttribute("padding", value)}
      />
    </>
  );
};

export default ColumnProperties; 