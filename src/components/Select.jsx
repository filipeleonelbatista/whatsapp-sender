import styles from "../styles/components/Select.module.css";

function Select({
  id,
  label,
  placeholder,
  onChange,
  value,
  required,
  type = "text",
  disabled,
  options = [],
  error = false,
  helperText = "",
  ...rest
}) {

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} style={{ color: error ? "#f44336" : "#128c7e" }}>
          {label}
          {required && "*"}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        placeholder={`${placeholder && required ? placeholder + "*" : ""}`}
        disabled={disabled}
        {...rest}
        style={{
          border: error ? "2px solid #f44336" : "1px solid #128c7e"
        }}
      >
        {
          options.map((option, index) => (
            <option key={index} value={option.value} selected={index === 0} disabled={index === 0}>{option.key}</option>
          ))
        }
      </select>
      <p style={{ marginLeft: "8px", fontSize: "12px", color: error ? "#f44336" : "#121212" }}>
        {helperText}
      </p>
    </div>
  );
}

export default Select;
