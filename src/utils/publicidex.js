export const publicidex = (publicid) => {
    const urlArr = publicid.split("/");
    const fristValue = urlArr[urlArr.length -2];
    const lastValue = urlArr[urlArr.length -1].split(".")[0];
    const finalValue = `${fristValue}/${lastValue}`;
    console.log(finalValue);
    return finalValue
}

publicidex('https://res.cloudinary.com/dwhecnggl/image/upload/v1720958641/user/github-logo_gyarre.jpg')