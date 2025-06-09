// HELPER FUNCTIONS ==> FOR EASIER AND MORE READABLE CODE USED IN AUTHENTICATION.JS

// FS MODULE
const fs = require('fs');
const path = require('path'); 
const usersFile = path.join(__dirname, 'users.json'); // New users(senders) are put in json file
const ordersFile = path.join(__dirname, './orders.json'); // BUYERS JSON PATH

//READLINE INPUT
const readline = require('readline');
const rl = readline.createInterface({ // handling inputs
    input:process.stdin,
    output:process.stdout
})

// PROMISE
function question(string){ 
    return new Promise((resolve) => rl.question(string, resolve));
}

// ENCRYPTING PASSWORDS
const crypto = require('crypto');
function hashPassword(password){
    return crypto.createHash('sha512').update(password).digest('hex');
}


// LOAD FILES
function loadFile(file){
    try{
        if(!fs.existsSync(file)){
            fs.writeFileSync(file, '[]', 'utf8'); // if doesn't exist, create the file with [] for easier approach
            return []; // we must return because of saveUsers function  for pushing users
        }

        const data = fs.readFileSync(file, 'utf8').trim(); // read the file

        if (data === ''){ // if the json file is empty just add [] to start with array
            return [];
        }

        const parsed = JSON.parse(data); // JSON to JS
        if(!Array.isArray(parsed)) throw new Error("❌ Invalid JSON format. expected an array.");
        return parsed;

    } catch(error){
        console.error('❌ Failed to load the file. Reason: ', error.message);
        process.exit(1); // ends the program
    }
}


// SAVE USERS
function saveUser(user){
    const users = loadFile(usersFile); // first call it to not overwrite users

    users.push(user); // now add the new one
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2)) // ATTENTION, if we write the file first without loading, it will overwrite thw whole file and we will lose all the users
    // users, null, 2 is for better and cleaned code for reading
}

// SAVE ORDERS
function saveOrder(order){
    const orders = loadFile(ordersFile); 

    orders.push(order); // now add the new one
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2)) 
}

// GENERATING RANDOM PASSWORD
function generatePassword(){ 
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(),.?":{}|<>';
    let password = '';
    for(let i = 0; i < 10; i++){ // fixed length: 10
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
}

// VALIDATION FOR PASSWORD
function validatePassword(password){
    const passwordMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!passwordMinLength) return 'Password must have at least 8 characters.';
    if (!hasUppercase) return 'Password must have at least one uppercase letter.';
    if (!hasNumber) return 'Password must have at least one number.';
    if (!hasSymbol) return 'Password must have at least one symbol.';

    return true; // if everything passes, return true
}

// VALIDATION FOR NAME
function validateName(name){
    const nameRegex = /^[A-Za-z]+$/;
    if(nameRegex.test(name)){
        return true;
    } else{
        return '❌ Invalid. Only letters';
    }
}

// VALIDATION FOR CITY(MACEDONIAN ONLY)
function validateCity(city){
    const macedonianCities = [
    "skopje", "bitola", "kumanovo", "prilep", "tetovo", "veles", "ohrid", "gostivar", "stip", 
    "strumica", "kocani", "kicevo", "radovis", "sveti nikole", "negotino", "gevgelija", "debar", 
    "kavadarci", "berovo", "vinica", "delcevo", "resen", "kriva palanka", "kratovo", "probistip", 
    "demir hisar", "makedonski brod", "valandovo", "krusevo", "struga", "demir kapija", "pehcevo"
    ];
    
    return macedonianCities.includes(city) ? true : '❌ This is not a city in Macedonia(Type in latin)';
    
}

// VALIDATION FOR PHONE NUMBER
function validatePhoneNumber(phoneNumber){
    const phoneRegex = /^(07\d{7}|003897\d{7})$/; // phone regex for Macedonia
    if(phoneRegex.test(phoneNumber)){
        return true;
    } else{
        return '❌ Invalid. Example for Macedonia: 077446614 or 0038971653789';
    }

}

// VALIDATION FOR HOME ADRESS 
function validateHomeAdress(adress){
    const addressRegex = /^[A-Za-z0-9\s,.\-/]+$/;

    if (/^\d+$/.test(adress.trim())) {
        return '❌ Address cannot be only numbers!';
    }

    if(addressRegex.test(adress)){
        return true;
    } else{
        return '❌ Invalid adress! Try again';
    }
}

// FORGOT PASS
async function forgotPass(user, users) {
    while(true){
        let newPassword = (await question('Create unique password(8 chars min) or just type "generated" to generate random password: ')).trim();

        if(newPassword === 'generated'){
        newPassword = generatePassword();
        console.log(`Your generated password is: ${newPassword}`);
        } else {
            const validationPassword = validatePassword(newPassword); // Validate first
            if(validationPassword !== true){
                console.log(validationPassword);
                continue;
            }
        }
        

        user.password = hashPassword(newPassword); // Hashing the password
        updateUser(user, users);
        console.log('Password is reset successfully! Log in again\n');
        return newPassword;
    }
    
}

// UPDATE USERS FOR FORGOT PASS
function updateUser(updatedUser, users){
    const index = users.findIndex(u => u.username === updatedUser.username);                                
    if(index === -1) throw new Error('❌ User not found');


    users[index] = updatedUser;
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))    // BAD PRACTICE, INSTEAD OF UPDATING, I OVERWRITE IT(but for small tasks is awesome)
    
}

// CAPITALISE THE STRING
function capitalise(input){
    return input
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join()
}
        

// EXPORTING THE FUNCTIONS
module.exports = {
    hashPassword,
    loadFile,
    saveUser,
    saveOrder,
    rl,
    generatePassword,
    validatePassword,
    validatePhoneNumber,
    validateName,
    validateCity,
    validateHomeAdress,
    forgotPass,
    ordersFile,
    usersFile,
    capitalise,
    question
};