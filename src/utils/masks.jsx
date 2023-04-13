export const money = (e) => {
  let value = e;
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1,$2");
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
  return value;
};
export const date = (e) => {
  let value = e;
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3");
  return value;
};

export const numberOnly = (value) => {
  value = value.replace(/\D/g, "");
  return value;
};

export const phone = (value) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};

export const cep = (value) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value;
};

export const cpf = (value) => {
  if (!value.match(/^(\d{3}).(\d{3}).(\d{3})-(\d{2})$/)) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{2})$/, "$1-$2");
  }
  return value;
};

export function cnpj(value) {
  if (!value.match(/^(\d{2}).(\d{3}).(\d{3})\\(\d{4})-(\d{2})$/)) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
  }
  return value;
}
