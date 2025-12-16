const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const encode = (num) =>{
    let str = []
    while(num > 0){
        str.unshift(BASE62[num % 62]);
        num = Math.floor(num / 62);
    }
    return str.join('').padStart(7, "0");
}

const decode = (str) =>{
    let num = 0;
    for(let i = 0; i < str.length; i++){
        num = num * 62 + BASE62.indexOf(str[i]);
    }
    return num;
}

export { encode, decode };