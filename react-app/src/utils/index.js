//Desc: This file contains all the utility functions used in the application

export * from "./createFoodHelpers";


export const gettingTodaysDate = () => {
    let today = new Date().getTime();
    today = new Date(today);
    const year = today.getFullYear();
    const month =
      today.getMonth() >= 10
        ? today.getMonth() + 1
        : `0${today.getMonth() + 1}`;
    const day = today.getDate();
    const formattedDate =
      day >= 10 ? `${year}-${month}-${day}` : `${year}-${month}-0${day}`;

    return formattedDate;
}


export const formattingUserInputDate = (userDate) => {
    let date = new Date(userDate).getTime();
    date = new Date(date);
    const year = date.getFullYear();
    const month =
      date.getMonth() >= 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    const day = date.getDate();
    const formattedDate =
      day >= 10 ? `${year}-${month}-${day}` : `${year}-${month}-0${day}`;

    return formattedDate;
}
