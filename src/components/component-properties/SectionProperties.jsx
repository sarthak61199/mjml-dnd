import { ColorProperty, TextProperty } from "@/components/properties";

const SectionProperties = ({ selectedComponent, updateAttribute }) => {
  return (
    <>
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

export default SectionProperties; 