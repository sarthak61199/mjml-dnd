const TextAreaProperty = ({
  label,
  value,
  onChange,
  rows = 4,
  placeholder = "",
  helpText = "",
}) => {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};

export default TextAreaProperty;
