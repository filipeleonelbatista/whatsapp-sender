import { useContext } from 'react';
import { ConversionContext } from '../context/ConversionContext';

export function useConversion() {
  const value = useContext(ConversionContext)
  return value;
}