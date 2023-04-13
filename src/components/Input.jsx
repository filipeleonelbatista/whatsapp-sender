import styles from "../styles/components/Input.module.css";

function Input({
  id,
  label,
  placeholder,
  onChange,
  value,
  required,
  type = "text",
  disabled,
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
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={`${placeholder && required ? placeholder + "*" : ""}`}
        type={type}
        disabled={disabled}
        {...rest}
        style={{
          border: error ? "2px solid #f44336" : "1px solid #128c7e"
        }}
      />
      <p style={{ marginLeft: "8px", fontSize: "12px", color: error ? "#f44336" : "#121212" }}>
        {helperText}
      </p>
    </div>
  );
}

export default Input;
