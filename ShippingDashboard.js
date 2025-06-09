// THIS IS THE ADMIN PAGE OR DASHBOARD
// IT IS FOR THOSE WHO CAN WRITE THE ORDER DETAILS FROM HOME(ONLY FOR SENDERS!!!) 


/* TASKS: 

*/

// IMPORTS
const { question, rl } = require("./helperfunctions.js");
const { createOrder, listOrders, aboutUs } = require("./editOrders.js");




async function admin(user) {
    console.log(`\nLogged in successfully. Welcome "${user.username}" to Brza Pratka's admin.`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec
    while(true){
        const option = (await question('\n1. Create an order \n2. See orders \n3. About us \n4. Exit \n Choose from 1 to 4: ')).trim();

        if(option === '1'){
            await createOrder();
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec
            continue;
        } else if(option === '2'){
            await listOrders();
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec
            continue;
        } else if(option === '3'){
            await aboutUs();
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 sec
            continue;
        } else if(option === '4'){
            console.log(`Have a nice day ${user.username}`);
            break;
        } else{
            console.log('❌ Incorrect! Type from 1 to 4');
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec
            continue;
        }
    }
    
}


// EXPORT TO USED IN MAIN
module.exports = { admin };

