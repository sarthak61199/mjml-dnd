import { TextProperty } from "@/components/properties";

const ImageProperties = ({ selectedComponent, updateAttribute }) => {
  return (
    <>
      <TextProperty
        label="Image URL"
        value={selectedComponent.attributes.src || ""}
        onChange={value => updateAttribute("src", value)}
        placeholder="https://example.com/image.jpg"
      />
      <TextProperty
        label="Alt Text"
        value={selectedComponent.attributes.alt || ""}
        onChange={value => updateAttribute("alt", value)}
      />
      <TextProperty
        label="Width"
        value={selectedComponent.attributes.width || "100%"}
        onChange={value => updateAttribute("width", value)}
      />
    </>
  );
};

export default ImageProperties; 