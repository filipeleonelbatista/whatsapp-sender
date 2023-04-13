import { CircleNotch } from "phosphor-react";

import styles from "../styles/components/Loading.module.css";

export function Loading() {
  return (
    <div className={styles.container}>
      <CircleNotch />
    </div>
  );
}
