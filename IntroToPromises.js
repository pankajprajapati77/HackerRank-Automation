//callback
const fs = require('fs');
console.log("before");

//synchronous working
//let data = fs.readFileSync("f1.txt");

//asynchronous working
// let data = fs.readFile("f1.txt", cb);
// function cb(err, data){
//     if(err){
//         console.log(err);
//     }
//     else console.log(data + "");
// }
// console.log(data + "");

//Promises Working

let PromiseThatFileWillBeRead = fs.promises.readFile("f1.txt");
console.log(PromiseThatFileWillBeRead);
PromiseThatFileWillBeRead.then(printdata);
PromiseThatFileWillBeRead.catch(printerror);

console.log("after");

function printdata(data){
    console.log("Promise is fulfilled");
    console.log(data+"");
}
function printerror(err){
    console.log(err);
}