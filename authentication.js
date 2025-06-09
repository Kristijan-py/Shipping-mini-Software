// THIS FILE IS FOR SIGN UP AND LOGIN SECTION OF THE SHIPPING SOFTWARE AND EXPORTING TO MAIN.JS

/* TASKS:
when signup does the job, cannot connect with login

*/

//////////////////////////////////////////////////


// IMPORTING FROM HELPER FUNCTIONS
const {
    hashPassword,
    loadFile,
    saveUser,
    generatePassword,
    validatePassword,
    validatePhoneNumber,
    forgotPass,
    rl,
    usersFile,
    question,
    validateName
} = require('./helperfunctions.js')

const readlineSync = require('readline-sync'); // FOR HIDING PASSWORD IN THE TERMINAL


//LOGIN
async function login() {
    const users = loadFile(usersFile);

    while(true){
        // Ask for user or email
        const email = (await question('Enter Email to Log in: ')).trim().toLowerCase();

        const user = users.find(u => u.email.toLowerCase() === email);
        if(!user){
            console.log('❌ User with this email not found, try again or register a new one!');
            continue;
        }
        // Ask for password
        let userPassword = readlineSync.question('Enter your password(if you forgot, type "f" to change it): ', {
            hideEchoBack: true, // hiding the input
            mask: '*' // hiding with *
        });

        // FORGOT PASS PART
        if(userPassword.toLowerCase() === 'f'){
            userPassword = await forgotPass(user, users); // to take the returned password
            continue; // Ask again for login
        } else{ // CHECKING THE PASS IS IT THE SAME AS SIGNED UP
            const hashedPassword = hashPassword(userPassword);
            if(hashedPassword === user.password){
                return user;
            } else{
                console.log('❌ Invalid password, try again or type "f" to change the password');
                continue;
            }
        }
    }
}




///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////


// SIGN UP
async function askName() {
    while(true){
        const newName = (await question('Enter your Name: ')).trim();
    
        const validationName = validateName(newName);
        if(!validationName) {
            console.log(validationName);
            continue;
        }

        console.log(`✅ Name: "${newName}" accepted.`);
        return newName;
    }
}

// ADDING EMAIL
async function addEmail() {
    while(true){
        const email = (await question('Add your email here: ')).trim();
        const emailValidation = /^[a-z][a-z0-9._-]*@[a-z]+\.[a-z]{2,4}$/.test(email); // for EMAIL validation

        // Checking if email already exist
        const users = loadFile(usersFile);
        const existEmail = users.some(u => u.email === email);

        if(existEmail){
            console.log('❌ Email already exist. Try another one');
            continue;
        }

        if(emailValidation){
            console.log('✅ Email valid!');
            return email;
            
        } else{
            console.log('❌ Email invalid. Try again or check here for valid email info => https://instantly.ai/blog/how-to-check-if-an-email-is-valid/');
            continue;
        }
    }
    
}

// ADDING PHONE NUMBER
async function addPhoneNumber() {
    while(true){
        const phone = (await question('Add your phone number(write it without spaces): ')).trim()
        const validationNumber = validatePhoneNumber(phone);

        // Checking if phone number aslready exist
        const users = loadFile(usersFile);
        const existPhoneNumber = users.some(u => u.phoneNumber === phone);

        if(existPhoneNumber){
            console.log('❌ Phone number already exist. Try another one');
            continue;
        }

        if(validationNumber !== true){
            console.log(validationNumber); // it will log the error
            continue;
        }
        return phone;
    }
}



// CREATING PASSWORD
async function createPassword() {
    while(true){
        const passwordInput = readlineSync.question('Create unique password(8 chars min) or just type "generated" to generate random password: ', {
            hideEchoBack: true, // hiding the input
            mask: '*' // hiding with *
        });
        let finalPassword;

        if(passwordInput === 'generated'){
            finalPassword = generatePassword();
            console.log(`Your generated password is: ${finalPassword}`); // not good to show this but because it is backend we cannot see the generated pass like with frontend
            return finalPassword;

        } else{
            const validationPassword = validatePassword(passwordInput);
            if(validationPassword !== true){
                console.log(validationPassword); // it will log the error
                continue;
            }
            finalPassword = passwordInput;
            return finalPassword;
        }
    }
    
}

// calling NAME, PHONENUMBER, EMAIL, PASSWORD HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!
async function signup() {
    const name = await askName();
    const phoneNumber = await addPhoneNumber();
    const email = await addEmail();
    const password = await createPassword();


    //////////////////////////////////
    // HASHING AND SAVING THE NEW USER
    const encryptedPassword = hashPassword(password); // encrypt the password

    const newUser = {
        name: name, 
        phoneNumber: phoneNumber,
        email: email, 
        password: encryptedPassword
    }

    try {
        const NEWUSER = saveUser(newUser); // save it inside JSON
        console.log('✅ Account created. Proceeding to log in...\n');
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec for login(no need but I wanted to be like in reality)
        return NEWUSER;
        
        
    } catch (error) {
        console.error(error);
    }

}


module.exports = { login, signup };

