import { useContext } from "react";
import { ResizeContext } from "../context/ResizeContext";

export function useResize() {
  const value = useContext(ResizeContext);
  return value;
}
