export default function celular(value: any): string {
  var valueNumber = parseInt(value.replace(/\D/g, ''))
  var newValue = valueNumber.toString().replace(/\D/g, '');
  newValue = newValue.replace(/^(\d{2})(\d)/g, '($1) $2');
  newValue = newValue.replace(/(\d)(\d{4})$/, '$1-$2');

  return newValue;
}
