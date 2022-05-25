let mypromise =new Promise(function(resolve, reject){
    let num1 = 1;
    let num2 = 1;
    let string = "Values is equal to 2";
    if(num1 + num2 == 2){
        resolve(string);
    }
    else{
        reject("No, values are not equal");
    }
});
mypromise.then(function(string){
    console.log("in.then", string);
});
mypromise.catch(function(err){
    console.log(err);
});