import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";

export function useLoading() {
  const value = useContext(LoadingContext);
  return value;
}
