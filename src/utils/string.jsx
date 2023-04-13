export const isStringEmpty = (text) => {
  return text === "";
};

export const yearNow = (date) => {
  const newDate = new Date(date).getFullYear();
  const currentDate = new Date(Date.now()).getFullYear();
  return currentDate - newDate;
};

export const pad = (num) => {
  return num < 10 ? "0" + num : num;
};

export const dateToString = (date) => {
  const newDate = new Date(date);
  const dateString = `${pad(newDate.getDate())}/${pad(
    newDate.getMonth() + 1
  )}/${newDate.getFullYear()}`;
  return dateString;
};

export const stringToDate = (str) => {
  const date_regex = /^\d{2}\/\d{2}\/\d{4}$/;

  const isMatch = date_regex.test(str);

  if (isMatch) {
    const currentStrDate = str.split("/");
    return new Date(
      currentStrDate[2],
      Number(currentStrDate[1]) - 1,
      currentStrDate[0]
    );
  }
  return "NAD";
};
