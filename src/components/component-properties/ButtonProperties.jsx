import { AlignmentProperty, ColorProperty, TextProperty } from "@/components/properties";

const ButtonProperties = ({ selectedComponent, updateAttribute, updateContent }) => {
  return (
    <>
      <TextProperty
        label="Button Text"
        value={selectedComponent.content || ""}
        onChange={updateContent}
      />
      <AlignmentProperty
        label="Text Alignment"
        value={selectedComponent.attributes.align || "center"}
        onChange={value => updateAttribute("align", value)}
        type="horizontal"
      />
      <TextProperty
        label="URL"
        value={selectedComponent.attributes.href || ""}
        onChange={value => updateAttribute("href", value)}
        placeholder="https://example.com"
      />
      <ColorProperty
        label="Background Color"
        value={selectedComponent.attributes["background-color"]}
        onChange={value => updateAttribute("background-color", value)}
        defaultColor="#0000FF"
      />
      <ColorProperty
        label="Text Color"
        value={selectedComponent.attributes.color}
        onChange={value => updateAttribute("color", value)}
        defaultColor="#FFFFFF"
      />
    </>
  );
};

export default ButtonProperties; 