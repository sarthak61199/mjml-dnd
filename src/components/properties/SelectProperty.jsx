const SelectProperty = ({
  label,
  value,
  onChange,
  options = [],
  defaultValue = "",
  helpText = "",
}) => {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full p-2 border border-gray-300 rounded"
        value={value || defaultValue}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
};

export default SelectProperty;
