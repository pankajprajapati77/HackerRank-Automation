const puppeteer = require("puppeteer");
let {email, password} = require('./secrets');
// let email = "";
// let password = "";
let {answer} = require("./codes");
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
.then(function(data){
    console.log("Hackerrank lagin page opened");
    let emailWillBrTypedPromise = cTab.type("#input-1", email);
    return emailWillBrTypedPromise;
})
.then(function(){
    console.log("email is typed");
    let passwordWillBeTypedPromise = cTab.type("#input-2", password);
    return passwordWillBeTypedPromise;
})
.then(function(){
    console.log("password has been typed");
    let willBeLoggedInPromise = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
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
    //console.log(linksArr);
     //to solve questions

    let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
    for(let i = 1; i < linksArr.length; i++){
        questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function(){
            return questionSolver(linksArr[i], i);
        })
    }
    return questionWillBeSolvedPromise;
})
.then(function(){
    console.log("question is solved");
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
            reject(err);
    })
});
return waitClickPromise;
}
function questionSolver(url, idx){
    return new Promise(function (resolve, reject){
        let fullLink = `https://www.hackerrank.com${url}`;
        let gotoQuesPagePromise = cTab.goto(fullLink);
        gotoQuesPagePromise
        .then(function(){
            console.log("question opened");
            //tick the custom input box mark
            let waitforCheckBoxAndClickPromise = waitandClick(".checkbox-input");
            return waitforCheckBoxAndClickPromise
        })
        .the(function(){
            //select the box where code will be typed
            let waitforTextBoxPromise = cTab.waitForSelector(".custominput");
            return waitforTextBoxPromise;
        })
        .then(function(){
            let codeWillBeTypedPromise = cTab.type(".custominput", answer[idx], {delay: 100});
            return codeWillBeTypedPromise;
        })
        .then(function(){
            //control key is pressed promise
            let controlPressedPromise = cTab.keyboard.down("Control");
            return controlPressedPromise;
        })
        .then(function(){
            let aKeyPressedPromise = cTab.keyboard.press("a");
            return aKeyPressedPromise;
        })
        .then(function(){
            let xKeyPressedPromise = cTab.keyboard.press("x");
            return xKeyPressedPromise;
        })
        .then(function(){
            let ctrlIsReleasedPromise = cTab.keyboard.up("Control");
            return ctrlIsReleasedPromise;
        })
        .then(function(){
            //select the editor promise
            let cursorOnEditorPromise = cTab.click(".monaco-editor.no-user-select.vs");
            return cursorOnEditorPromise;
        })
        .then(function(){
            //control key is pressed promise
            let controlPressedPromise = cTab.keyboard.down("Control");
            return controlPressedPromise;
        })
        .then(function(){
            let aKeyPressedPromise = cTab.keyboard.press("A");
            return aKeyPressedPromise;
        })
        .then(function(){
            let vKeyPressedPromise = cTab.keyboard.press("V");
            return vKeyPressedPromise;
        })
        .then(function(){
            let controlDownPromise = cTab.keyboard.up("Control");
            return controlDownPromise;
        })
        .then(function(){
            let SubmitbuttonClickedPromise = cTab.click(".hr-monaco-submit");
            return SubmitbuttonClickedPromise;
        })
        .the(function(){
            console.log("code submitted successfully");
            resolve();
        })
        .catch(function(err){
            reject(err);
        });
    });
}
