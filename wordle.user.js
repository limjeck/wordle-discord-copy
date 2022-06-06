// ==UserScript==
// @name         Wordle discord copy
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the wordle!
// @author       oneplusone
// @match        https://www.nytimes.com/games/wordle/index.html*
// @match        https://worldle.teuteuf.fr/*
// @match        https://oec.world/en/tradle/*
// @match        https://www.quordle.com/*
// @match        https://www.symble.app/*
// @match        https://xordle.xyz/*
// @match        https://fibble.xyz/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function modifyClipboard(){
        (function(proxied) {
            let _oldWriteText = navigator.clipboard.writeText;
            navigator.clipboard.writeText = function() {
                navigator.clipboard.lastCall = arguments;
                return _oldWriteText.apply(this, arguments);
            };
        })(navigator.clipboard.writeText);
    }

    function doWordle(){
        let gameApp = document.getElementsByTagName("game-app")[0];
        let obs = new MutationObserver((mutationsList, obs) => {
            for(let mutation of mutationsList){
                for(let node of mutation.addedNodes){
                    if(node.tagName === "GAME-STATS"){
                        let disc = document.createElement("button");
                        disc.innerText = "SHARE DISCORD";
                        disc.addEventListener("click", (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            let state = {
                                evaluations: gameApp.evaluations,
                                dayOffset: gameApp.dayOffset,
                                rowIndex: gameApp.rowIndex,
                                isHardMode: gameApp.hardMode,
                                isWin: gameApp.gameStatus === "WIN",
                                boardState: gameApp.boardState
                            };
                            let ans = `Wordle ${state.dayOffset} ${state.isWin ? state.rowIndex : "X"}/6${state.isHardMode ? "*" : ""}\n\n`;
                            let ansgrid = [];
                            for(let i=0; i<state.rowIndex; i++){
                                let row = state.evaluations[i].map((x) => {
                                    if(x === "correct"){
                                        return "🟩";
                                    }else if(x === "present"){
                                        return "🟨";
                                    }else{
                                        return "⬛";
                                    }
                                }).join("");
                                row += ` ||\`${state.boardState[i].toUpperCase()}\`||`;
                                ansgrid.push(row);
                            }
                            ans += ansgrid.join("\n");
                            navigator.clipboard.writeText(ans).then(() => {
                                gameApp.addToast("Copied results to clipboard", 2e3, !0);
                            });
                        });
                        gameApp.shadowRoot.querySelector("game-stats").shadowRoot.getElementById("share-button").parentNode.appendChild(disc);
                    }
                }
            }
        });
        obs.observe(gameApp.shadowRoot.querySelector("game-modal"), {childList: true});
    }

    function doWorldle(){
        let discord = false;
        function addBtn(){
            if(document.querySelector(".mybtn")) return;
            let btn = document.createElement("button");
            btn.className = "mybtn rounded font-bold border-2 p-1 uppercase bg-green-600 hover:bg-green-500 active:bg-green-700 text-white w-full";
            btn.innerText = "Share discord";
            let sharebtn = document.querySelector(".my-2 button");
            if(sharebtn && sharebtn.innerText === "SHARE"){
                sharebtn.after(btn);
            }else{
                return;
            }
            btn.addEventListener("click", (event) => {
                discord = true;
                document.querySelector(".my-2 button").click();
            });
            let copyobs = new MutationObserver((mutationList, obs) => {
                if(!discord) return;
                for(let mutation of mutationList){
                    for(let node of mutation.addedNodes){
                        if(node.tagName !== "SPAN") continue;
                        let ans = node.innerText.split('\n');
                        let guesses = Array.from(document.querySelectorAll(".grid .text-ellipsis")).map((x) => x.innerText.padEnd(30));
                        guesses.forEach((x, i) => {
                            ans[i + 1] += ` ||\`${x}\`||`;
                        })
                        navigator.clipboard.writeText(ans.join("\n"));
                        discord = false;
                    }
                }
            });
            copyobs.observe(document.body, {childList: true});
        }
        addBtn();
        let obs = new MutationObserver((mutationList, obs) => {
            addBtn();
        });
        obs.observe(document.querySelector("#root"), {childList: true, subtree: true});
    }

    function doTradle(){
        let discord = false;
        function addBtn(){
            if(document.querySelector(".mybtn")) return;
            let btn = document.createElement("button");
            btn.className = "mybtn p-2 mt-4 rounded-lg font-semibold bg-oec-orange hover:bg-oec-yellow active:bg-oec-orange text-white w-full";
            btn.innerText = "Share discord";
            let sharebtn = document.querySelector(".my-2 button");
            if(sharebtn && sharebtn.innerText === "Share"){
                sharebtn.after(btn);
            }else{
                return;
            }
            btn.addEventListener("click", (event) => {
                discord = true;
                document.querySelector(".my-2 button").click();
            });
            let copyobs = new MutationObserver((mutationList, obs) => {
                if(!discord) return;
                for(let mutation of mutationList){
                    for(let node of mutation.addedNodes){
                        if(node.tagName !== "SPAN") continue;
                        let ans = node.innerText.split('\n');
                        let guesses = Array.from(document.querySelectorAll(".grid .text-ellipsis")).map((x) => x.innerText.slice(5).padEnd(30));
                        guesses.forEach((x, i) => {
                            ans[i + 1] += ` ||\`${x}\`||`;
                        })
                        navigator.clipboard.writeText(ans.join("\n"));
                        discord = false;
                    }
                }
            });
            copyobs.observe(document.body, {childList: true});
        }
        addBtn();
        let obs = new MutationObserver((mutationList, obs) => {
            addBtn();
        });
        obs.observe(document.querySelector("#root"), {childList: true, subtree: true});
    }

    function doQuordle(){
        function addBtn(){
            if(document.querySelector(".mybtn")) return;
            let copybtn = document.querySelector("[aria-label='Copy to Clipboard']");
            if(copybtn === null) return;
            let btn = document.createElement("button")
            btn.className = "mybtn text-lg min-h-[40px] text-white bg-blue-800 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors";
            btn.innerText = "Share discord";
            copybtn.after(btn);
            btn.addEventListener("click", (event) => {
                let ans = document.querySelector("textarea").innerHTML.split("\n");
                let letters = Array.from(document.querySelectorAll(".quordle-box-content")).map((x) => x.innerText);
                let num_guesses = 9;
                let word_len = 5;
                let num_words = 4;
                let guesses = [];
                let tries = [];
                for(let j=0; j<num_words; j++){
                    tries.push(0);
                    for(let i=0; i<num_guesses; i++){
                        if(letters[word_len*(j*num_guesses+i)] !== ""){
                            tries[j] = i + 1;
                        }
                    }
                }
                let last = 0;
                for(let j=1; j<num_words; j++){
                    if(tries[j] > tries[last]){
                        last = j;
                    }
                }
                for(let i=0; i<tries[last]; i++){
                    let word = letters.slice(word_len*(last*num_guesses+i), word_len*(last*num_guesses+i+1)).join("");
                    guesses.push(word);
                }
                guesses.forEach((guess, i) => {
                    let index = i + 4;
                    if(last > 1){
                        index = i + 5 + Math.max(tries[0], tries[1]);
                    }
                    ans[index] += ` ||\`${guess}\`||`;
                });
                navigator.clipboard.writeText(ans.join("\n")).then(() => {
                    alert("Copied to clipboard!");
                });
            });
        }
        addBtn();
        let obs = new MutationObserver((mutationList, obs) => {
            addBtn();
        });
        obs.observe(document.querySelector("#root"), {childList: true, subtree: true});
    }

    function doSymble(){
        modifyClipboard();
        function addBtn(){
            if(document.querySelector(".mybtn")) return;
            let copybtn = document.querySelector("button.share-button");
            if(copybtn === null) return;
            let btn = document.createElement("button");
            btn.innerHTML = " SHARE DISCORD ";
            btn.className = "mybtn";
            copybtn.after(btn);
            btn.addEventListener("click", (event) => {
                copybtn.click();
                let ans = navigator.clipboard.lastCall[0].split("\n");
                let chars = Array.from(document.querySelectorAll(".tile.flipped .flipped")).map(x => x.innerText);
                let num_guesses = chars.length / 5;
                let guesses = [];
                for(let i=0; i<num_guesses; i++){
                    let guess = chars.slice(5*i, 5*(i+1)).join("");
                    ans[i+1] += ` ||\`${guess}\`||`;
                }
                navigator.clipboard.writeText(ans.join("\n"));
            });
        }
        addBtn();
        let obs = new MutationObserver((mutationList, obs) => {
            addBtn();
        });
        obs.observe(document.body, {childList: true, subtree: true});
    }

    function doXordle(){
        modifyClipboard();
        function addBtn(){
            if(document.querySelector(".mybtn")) return;
            let copybtn = document.querySelector("div[role='alert'] button");
            if(copybtn === null) return;
            let btn = document.createElement("button");
            btn.innerHTML = "share discord";
            btn.className = "mybtn";
            copybtn.after(btn);
            btn.addEventListener("click", (event) => {
                copybtn.click();
                let ans = navigator.clipboard.lastCall[0].split("\n");
                let chars = Array.from(document.querySelectorAll(".Row-locked-in .Row-letter:not(.Row-separator)")).map(x => x.innerText);
                let num_guesses = chars.length / 5;
                let guesses = [];
                for(let i=0; i<num_guesses; i++){
                    let guess = chars.slice(5*i, 5*(i+1)).join("");
                    ans[i+1] += ` ||\`${guess}\`||`;
                }
                navigator.clipboard.writeText(ans.join("\n"));
            });
        }
        addBtn();
        let obs = new MutationObserver((mutationList, obs) => {
            addBtn();
        });
        obs.observe(document.body, {childList: true, subtree: true});
    }

    function doFibble(){
        modifyClipboard();
        function addBtn(){
            if(document.querySelector(".mybtn")) return;
            let copybtn = document.querySelector(".Game > p button");
            if(copybtn === null) return;
            let btn = document.createElement("button");
            btn.innerHTML = "share discord";
            btn.className = "mybtn";
            copybtn.after(btn);
            btn.addEventListener("click", (event) => {
                copybtn.click();
                let ans = navigator.clipboard.lastCall[0].split("\n");
                let chars = Array.from(document.querySelectorAll(".Row-locked-in .Clue-letter")).map(x => x.innerText);
                let num_guesses = chars.length / 5;
                let guesses = [];
                for(let i=0; i<num_guesses; i++){
                    let guess = chars.slice(5*i, 5*(i+1)).join("");
                    ans[i+1] += ` ||\`${guess}\`||`;
                }
                navigator.clipboard.writeText(ans.join("\n"));
            });
        }
        addBtn();
        let obs = new MutationObserver((mutationList, obs) => {
            addBtn();
        });
        obs.observe(document.body, {childList: true, subtree: true});
    }

    switch(window.location.host){
        // Wordle
        case "www.nytimes.com":
            doWordle();
            break;

        // Worldle
        case "worldle.teuteuf.fr": 
            doWorldle();
            break;

        // Tradle
        case "oec.world":
            doTradle();
            break;

        // Quordle
        case "www.quordle.com":
            doQuordle();
            break;

        // Symble
        case "www.symble.app":
            doSymble();
            break;

        // Xordle
        case "xordle.xyz":
            doXordle();
            break;

        // Fibble
        case "fibble.xyz":
            doFibble();
            break;
    }
})();
