import SelectProperty from "@/components/properties/SelectProperty";
import { HORIZONTAL_ALIGN_OPTIONS, VERTICAL_ALIGN_OPTIONS } from "@/constants/propertyOptions";

const AlignmentProperty = ({
  label,
  value,
  onChange,
  type = "horizontal", // or "vertical"
  helpText = "",
}) => {
  const options = type === "vertical" ? VERTICAL_ALIGN_OPTIONS : HORIZONTAL_ALIGN_OPTIONS;
  const defaultValue = type === "vertical" ? "top" : "left";

  return (
    <SelectProperty
      label={label || `${type.charAt(0).toUpperCase() + type.slice(1)} Alignment`}
      value={value}
      onChange={onChange}
      options={options}
      defaultValue={defaultValue}
      helpText={helpText}
    />
  );
};

export default AlignmentProperty;
