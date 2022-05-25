const puppeteer = require("puppeteer");
let { email, password } = require('./secrets');
// let email = "";
// let password = "";
let cTab;
let browserOpenPromise = puppeteer.launch({ //browser ka object dega ye
    headless : false,
    defaultViewport : null,
    args : ["--start-maximized"],
    //executablePath : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
browserOpenPromise 
    .then (function(browser){ //ye fullfill h to browser ayega isme
    console.log("browser is open");
 //browser.pages => an array of all open pages inside the browser
    let allTabsPromise = browser.pages();
    return allTabsPromise;
})
.then(function (allTabsArr){
    cTab = allTabsArr[0];
    console.log("new tab");
    //URL to navigate page to
    let visitingLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromise;
})
.then(function(){
    console.log("Hackerrank lagin page opened");
    let emailWillBrTypedPromise = cTab.type("#input-1", email);
    return emailWillBrTypedPromise;
})
.then(function(){
    console.log("email is typed");
    let passwordWillBeTypedPromise = cTab.type("#input-2", password,{delay: 100});
    return passwordWillBeTypedPromise;
})
.then(function(){
    console.log("password has been typed");
    let willBeLoggedInPromise = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled", {delay: 100});
    return willBeLoggedInPromise;
})
.then(function(){
    console.log("logged into hackerrank successfully");
    //waitandClick will wait for the selector to load, and then click on the node
    let algorithmTabWillBeOpenedPromise = waitandClick('div[data-automation="algorithms"]');
    return algorithmTabWillBeOpenedPromise;
})
.then(function(){
    console.log("algorithms pages is opened");
    let allQuesPromise = cTab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]');
    return allQuesPromise;
})
.then(function(){
    function getallQuesLinks(){
        let allelemArr = document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
        let linksArr = [];
        for(let i = 0; i < allelemArr.length; i++){
            linksArr.push(allelemArr[i].getAttribute("href"));
        }
        return linksArr;
    }
    let linksArrPromise = cTab.evaluate(getallQuesLinks);
    return linksArrPromise;
})
.then(function(linksArr){
    console.log("links to all ques received");
    console.log(linksArr);
    //to solve questions
})
.catch(function(err){
    console.log(err);
});
function waitandClick(algobtn){
    let waitClickPromise = new Promise(function(resolve, reject){
        let waitforSelectorPromise = cTab.waitForSelector(algobtn);
        waitforSelectorPromise
        .then(function(){
            console.log("algo btn is found");
            let clickPromise = cTab.click(algobtn);
            return clickPromise;
        })
        .then(function(){
            console.log("algo btn is clicked");
            resolve();
        })
        .catch(function(err){
            console.log(err);
    })
});
return waitClickPromise;
}
