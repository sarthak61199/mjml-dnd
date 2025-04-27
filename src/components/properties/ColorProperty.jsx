const ColorProperty = ({ label, value, onChange, defaultColor = "#000000", helpText = "" }) => {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="color"
        className="w-full p-1 border border-gray-300 rounded"
        value={value || defaultColor}
        onChange={e => onChange(e.target.value)}
      />
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};

export default ColorProperty;
