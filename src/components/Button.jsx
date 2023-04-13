import styles from "../styles/components/Button.module.css";

function Button({
  id,
  children,
  transparent = false,
  disabled = false,
  ...rest
}) {

  return (
    <button
      className={
        disabled
          ? styles.buttonDisabled
          : transparent
            ? styles.buttonTransparent
            : styles.button
      }
      id={id}
      {...rest}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
