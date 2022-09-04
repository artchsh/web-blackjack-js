let dealerCards = [];
let playerCards = [];
let sumDealerCards = 0;
let sumPlayerCards = 0;
let startCardsCount = 2;
let dealerCardsCount = 2;
let playerCardsCount = 2;
let playerMoney = 10000;
let playerBet;

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("page loaded!");
    document.getElementById("userMoney").innerText = `${playerMoney}`;
    document.getElementById("userBet").innerText = `0`;
    generateDealerCard();
    
});

function generateDealerCard() {
    document.getElementById("players").innerHTML += `
        <div class="">
            <h1 class="font-bold text-xl">
                Дилер
            </h1>
            <p>
                Карты: <span class="font-bold" id="dealerCardsBlurred"></span>
            </p>
        </div>
    `;
    generateCards();
}

function generateRandomCard() {
    let randomCard = Math.floor(Math.random() * 11);
    do {
        randomCard = Math.floor(Math.random() * 11);
    } while (randomCard === 0);
    return randomCard;
}

function generateCards() {
    document.getElementById("betButton").disabled = false;
    document.getElementById("addCard").disabled = true;
    document.getElementById("pass").disabled = true;//opacity-50
    document.getElementById("betButton").classList.remove('opacity-50');
    document.getElementById("bet").classList.remove('pointer-events-none');
    document.getElementById("pass").classList.add('opacity-50');
    document.getElementById("addCard").classList.add('opacity-50');
    for (let i = 0; i < startCardsCount; i++) {
        let card = generateRandomCard();
        playerCards.push(card);
        document.getElementById("userCards").innerHTML += `${card} `;
    }
    for (let i = 1; i < startCardsCount; i++) {
        document.getElementById("dealerCardsBlurred").innerHTML += "* ";
        dealerCards.push(generateRandomCard());
    }
    let dealerCardShow = generateRandomCard();
    dealerCards.push(dealerCardShow);
    document.getElementById(
        "dealerCardsBlurred"
    ).innerHTML += `${dealerCardShow} `;
}

function updateCards(person) {
    switch (person) {
        case "player":
            for (let i = 0; i < playerCardsCount; i++) {
                playerCards.pop();
            }
            break;
        case "dealer":
            for (let i = 0; i < dealerCardsCount; i++) {
                dealerCards.pop();
            }
            break;
        default:
            console.error("wrong person");
    }
}

function regenerateCards() {
    for (let i = 0; i < dealerCardsCount; i++) {
        dealerCards.pop();
    }
    for (let i = 0; i < playerCardsCount; i++) {
        playerCards.pop();
    }
    document.getElementById("userCards").innerHTML = "";
    document.getElementById("dealerCardsBlurred").innerHTML = "";
    generateCards();
}

function sumAllCards() {
    sumDealerCards = 0;
    sumPlayerCards = 0;
    for (let value of dealerCards) {
        sumDealerCards += value;
    }
    console.log(sumDealerCards);
    for (let value of playerCards) {
        sumPlayerCards += value;
    }
    console.log(sumPlayerCards);
}

// -1 - loose; 0 - draw; 1 - win
function WinDrawLose() {
    if (isInstantWin(sumPlayerCards)) {
        console.log("Player = 21");
        return 1;
    } else if (isInstantWin(sumDealerCards)) {
        console.log("Dealer = 21");
        return -1;
    } else if (
        isEnumeration(sumDealerCards) === true &&
        isEnumeration(sumPlayerCards) === false
    ) {
        console.log("Dealer > 21 && Player < 21");
        return 1;
    } else if (
        isEnumeration(sumPlayerCards) === true &&
        isEnumeration(sumDealerCards) === false
    ) {
        console.log("Player > 21 && Dealer < 21");
        return -1;
    } else if (
        sumPlayerCards > sumDealerCards &&
        sumDealerCards < 21 &&
        sumPlayerCards < 21
    ) {
        console.log("Player > Dealer && Dealer < 21 && Player < 21");
        return 0;
    } else if (sumDealerCards > sumPlayerCards) {
        console.log("Dealer > Player");
        return -1;
    } else {
        return 0;
    }
}

function dealerAddCard() {
    let card = generateRandomCard();
    dealerCards.push(card);
    dealerCardsCount++;
    document.getElementById("dealerCardsBlurred").innerHTML += `${card} `;
    console.log(dealerCards);
    sumAllCards();
}

function DealerTakesCards() {
    do {
        dealerAddCard();
    } while (sumDealerCards <= 17);
    let k = WinDrawLose();
    calculateNewBalance(k);
    let notifctx;
    let typectx;
    switch(k) {
        case -1:
            notifctx = "Вы проиграли ставку";
            typectx = 'red';
            break;
        case 0:
            notifctx = "Вам вернули ставку";
            typectx = 'yellow';
            break;
        case 1:
            notifctx = "Вы выиграли!";
            typectx = 'green';
            break;
    }
    newNotification(notifctx, typectx);
    setTimeout(() => {
        regenerateCards();
        newNotification('Новый раунд', 'green')
    }, 3000)
}

function isEnumeration(cardsSum) {
    return cardsSum > 21 ? true : false;
}
function isInstantWin(cardsSum) {
    return cardsSum === 21 ? true : false;
}
function calculateNewBalance(K) {
    let newBalance = playerMoney + playerBet * K;
    document.getElementById("userMoney").innerText = `${newBalance}`;
    sessionStorage.setItem("userMoney", newBalance);
    document.getElementById("userBet").innerText = 0;
    sessionStorage.setItem("betValue", 0);
}

function userStand() {
    let bet = Number(document.getElementById("userBet").innerText);
    if (bet === 0) {
        return newNotification('Перед тем как играть, укажите ставку!', 'red')
    } else {
        DealerTakesCards();
    }
}

function userHit() {
    playerCardsCount++;
    let userNewCard = generateRandomCard();
    playerCards.push(userNewCard);
    document.getElementById("userCards").innerHTML += `${userNewCard} `;
    sumAllCards()
    if (isEnumeration(sumPlayerCards)) {
        DealerTakesCards();
    } ;
}

/**
 * 
 * @param {string} message 
 * @param {string} type 
 */
function newNotification(message, type) {
    switch(type) {
        case 'green':
            document.getElementById("notif").classList.remove('text-blue-600');
            document.getElementById("notif").classList.remove('text-red-500');
            document.getElementById("notif").innerText = `${message}`;
            document.getElementById("notif").classList.add('text-green-500');
            break;
        case 'yellow':
            document.getElementById("notif").classList.remove('text-red-500');
            document.getElementById("notif").classList.remove('text-green-500');
            document.getElementById("notif").innerText = `${message}`;
            document.getElementById("notif").classList.add('text-blue-600');
            break;
        case 'red':
            document.getElementById("notif").classList.remove('text-blue-600');
            document.getElementById("notif").classList.remove('text-green-500');
            document.getElementById("notif").innerText = `${message}`;
            document.getElementById("notif").classList.add('text-red-500');
            break;
        default:
            console.error('type error ' + 1)
    }
    
}

function bet() {
    document.getElementById("betButton").disabled = true;
    document.getElementById("addCard").disabled = false;
    document.getElementById("pass").disabled = false;
    document.getElementById("bet").classList.add('pointer-events-none');
    document.getElementById("betButton").classList.add('opacity-50');
    document.getElementById("pass").classList.remove('opacity-50');
    document.getElementById("addCard").classList.remove('opacity-50');
    let bet = document.getElementById("bet").value;
    sessionStorage.setItem("betValue", bet);
    document.getElementById("userBet").innerText = bet;
    playerBet = bet
    newNotification(`Вы сделали ставку ${bet}$`, 'yellow');
}
