// FUNCTIONS FOR CREATING ORDERS


// IMPORTS
const { rl, question, validateName, validatePhoneNumber, validateCity, validateHomeAdress, capitalise } = require("./helperfunctions.js");



////////////////////////////////////////////////
async function senderName() {
    while(true){
        const input = (await question("Sender's name: ")).trim(); // SENDER'S NAME
        const isValidNameS = validateName(input)
        if(isValidNameS !== true){
            console.log(isValidNameS);
            continue;
        }
        return capitalise(input);   
    }
}

async function senderPhoneNumber() {
    while(true){
        const input = (await question("Sender's phone number: ")).trim(); // SENDER'S PHONE NUMBER
        const isValidPhoneNumberS = validatePhoneNumber(input);
        if(isValidPhoneNumberS !== true){
            console.log(isValidPhoneNumberS);
            continue;
        }
        return input;
    }
}

async function buyerName() {
    while(true){
        const input = (await question("Buyer's name: ")).trim(); // BUYER'S NAME
        const isValidNameB = validateName(input)
        if(isValidNameB !== true){
            console.log(isValidNameB); 
            continue;
        }
        return capitalise(input);
    }
}

async function buyerPhoneNumber() {
    while(true){
        const input = (await question("Buyer's phone number: ")).trim(); // BUYER'S PHONE NUMBER
        const isValidPhoneNumberB = validatePhoneNumber(input);
        if(isValidPhoneNumberB !== true){
            console.log(isValidPhoneNumberB);
            continue;
        }
        return input;
    }
}

async function buyerCity() {
    while(true){
        const input = (await question("Buyer's city: ")).trim().toLowerCase(); // BUYER'S CITY
        const isValidCity = validateCity(input);
        if(isValidCity !== true){
            console.log(isValidCity);
            continue;
        }
        return capitalise(input);
    }
}

async function buyerAdress() {
    while(true){
        let input = (await question("Buyer's adress: ")).trim(); // BUYER'S ADRESS
        if(input === ''){
            input = '/'; // If no adress, ship just to the base of the city
        }

        const isValidAdress = validateHomeAdress(input);
        if(isValidAdress !== true){
            console.log(isValidAdress);
            continue;
        }
        return capitalise(input);
    }
}

async function buyerVillageAdress() {
    while(true){
        let input = (await question("Buyer's village(leave empty if the buyer doesn't live in village): ")).trim().toLowerCase(); // BUYER'S VILLAGE ADRESS
        const letterRegex = /^[A-Za-z\s]+$/;

        if(input === ''){
            return '/';   // NO VALIDATION FOR MACEDONIAN VILLAGE BECAUSE WE HAVE 1700+
        } else if(letterRegex.test(input)){
            return capitalise(input);
        } else{
            console.log('❌ Invalid! Enter only letters!')
            continue;
        }
    }
}

async function price() {
    while(true){
        let input = (await question("Price for the package: ")).trim(); // BUYER'S PACKAGE PRICE

        if(input === ''){
            input = 0;
            return input;
        }

        input = parseInt(input); // convert to number
        if(input < 0){
            console.log('❌ Price cant be under 0!');
            continue;
        }
        if(isNaN(input)){
            console.log('❌ Please enter valid number!');
            continue;
        }
        return input;
    }
}

async function whosPaying() {
    let input = (await question("Whos paying the shipping fee(type 'm' for ME or type anythin else for buyer): ")).trim().toLowerCase(); // WHOS PAYING THE CARGO

    if(input === 'm'){
        return 'Sender';
    }
    return 'Buyer';
}




//EXPORTS
module.exports = { senderName, senderPhoneNumber, buyerName, buyerPhoneNumber, buyerCity, buyerAdress, buyerVillageAdress, price, whosPaying };