// PROJECT "BRZA PRATKA", LIKE A SHIPPING SOFTWARE WITH USERS ADDED TO JSON FILE, AUTHENTICATION PROCESS, ADMIN FILE(DASHBOARD) AND SO ON.


// IMPORTING FROM AUTH.JS
const { login, signup } = require('./authentication.js');

// IMPORTING FROM HELPERFUNCTIONS.JS
const { rl, question } = require('./helperfunctions.js');

// IMPORTING FROM SHIPPINGDASHBOARD.JS
const { admin } = require('./ShippingDashboard.js');

// IMPORTING FROM EDITORDERS>JS
const { createOrder } = require('./editOrders.js');


// ASK LOGIN OR SIGN UP
async function main() {
    while(true){
        const answer = (await question('\nWelcome to the Brza Pratka shipping company. Create account if you are new one or log in to the existing one! \n1. Signup\n2. Login\n3. Create an order \n4. Exit\nChoose one: ')).trim();
        
        if(answer === '1'){ // SIGN UP SECTION
            console.log('Proceeding to Sign Up...\n');
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec
            await signup();  
            const user = await login();
            await admin(user);
            break;

        } else if(answer ==='2'){ // LOGIN SECTION
            console.log('Proceeding to Log In...\n');
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec
            const user = await login();
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec
            await admin(user); 
            break;

        } else if(answer === '3'){ // CREATING ORDER
            await createOrder();
            break;

        } else if(answer === '4'){ // EXIT
            rl.close();
            console.log('Goodbye');
            break;

        } else{
            console.log('❌ Invalid, you must enter from 1 to 4 to continue.\n');
        }
    }
}

main();