import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export function useToast() {
  const value = useContext(ToastContext);
  return value;
}
