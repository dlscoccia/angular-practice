import { fromEvent, Subject } from 'rxjs';
import WORDS_LIST from './wordsList.json';

const letterRows = document.getElementsByClassName('letter-row');
const messageText = document.getElementById('message-text');
const onKeyDown$ = fromEvent(document, 'keydown');
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () =>
    WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(`Right word: ${rightWord}`);

const userWinOrLoose$ = new Subject();

const insertLetter = {
    next: (event) => {
        const pressedKey = event.key.toUpperCase();
        if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
            let letterBox =
                Array.from(letterRows)[letterRowIndex].children[letterIndex];
            letterBox.textContent = pressedKey;
            letterBox.classList.add('filled-letter');
            letterIndex++;
            userAnswer.push(pressedKey);
        }
    },
};

const checkWord = {
    next: (event) => {
        if (event.key === 'Enter') {
            if (userAnswer.length !== 5) {
                messageText.textContent = '¡Te faltan algunas letras!';
                return;
            }

            userAnswer.map((_, i) => {
                let letterColor = '';
                let letterBox = letterRows[letterRowIndex].children[i];
                let letterPosition = rightWord.indexOf(userAnswer[i]);

                if (rightWord[i] === userAnswer[i]) {
                    letterColor = 'letter-green';
                } else {
                    if (letterPosition === -1) {
                        letterColor = 'letter-grey';
                    } else {
                        letterColor = 'letter-yellow';
                    }
                }
                letterBox.classList.add(letterColor);
            });

            if (userAnswer.length === 5) {
                letterIndex = 0;
                userAnswer = [];
                letterRowIndex++;
            }

            if (userAnswer.join('') === rightWord) {
                userWinOrLoose$.next();
            }
        }
    },
};

const removeLetter = {
    next: (event) => {
        const pressedKey = event.key;
        if (pressedKey === 'Backspace' && letterIndex !== 0) {
            let letterBox =
                letterRows[letterRowIndex].children[userAnswer.length - 1];
            letterBox.textContent = '';
            letterBox.classList = 'letter';
            letterIndex--;
            userAnswer.pop();
        }
    },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
onKeyDown$.subscribe(removeLetter);

userWinOrLoose$.subscribe(() => {
    let letterRowsWinned = letterRows[letterRowIndex];
    for (let i = 0; i < 5; i++) {
        letterRowsWinned.children[i].classList.add('letter-green');
    }
});
