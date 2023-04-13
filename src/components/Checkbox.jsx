import styles from "../styles/components/Checkbox.module.css";

function Checkbox({
  id,
  label,
  required,
  onChange,
  checked,
  disabled,
  ...rest
}) {

  return (
    <div className={styles.container}>
      <label htmlFor={id}>
        <input
          id={id}
          checked={checked}
          onChange={onChange}
          type="checkbox"
          disabled={disabled}
          {...rest}
        />
        {label}
        {required && "*"}
      </label>
    </div>
  );
}

export default Checkbox;
