// All THE SERVICES FROM "BRZA PRATKA"


/* TASKS:
MAIN PROBLEM: TO MAKE FOR EVERYONE WHO LOGINS IN TO HAVE HIS OWN ORDERS NOT TO SHOW ALL OF THEM COMBINED(ALSO WE DONT NEED SENDERS INFO IF HE IS LOGGED!!!)

*/



// IMPORTS
const { question, rl, saveOrder, ordersFile } = require("./helperfunctions.js");
const path = require('path');
const fs = require('fs');
const { senderName, senderPhoneNumber, buyerName, buyerPhoneNumber, buyerCity, buyerAdress, buyerVillageAdress, price, whosPaying } = require("./orderHelperFunctions.js");


// Creating order
async function createOrder() {
    while(true){
        const option = (await question('\n1. Manual \n2. With file \n Choose one: ')).trim();
        // MANUAL
        if(option === '1'){
            const Sname = await senderName();
            const Sphone = await senderPhoneNumber();
            const Bname = await buyerName();
            const Bphone = await buyerPhoneNumber();
            const Bcity = await buyerCity();
            const Bvillage = await buyerVillageAdress();
            const Badress = await buyerAdress();
            const pricePerOrder = await price();
            const payer = await whosPaying()
            

            // ADD TO JSON FILE PART AND SAVE BUYER
            let newOrder = {
                sender_name: Sname, // SENDER'S INFO
                sender_phone: Sphone,

                buyer_name: Bname, // BUYER'S INFO
                buyer_phone: Bphone,
                buyer_city: Bcity,
                buyer_village: Bvillage,
                buyer_adress: Badress,
                price_per_order: pricePerOrder,
                shipping_fee: 150,
                whos_paying: payer
            }

            try {
                saveOrder(newOrder);
                console.log('✅ Order created successfully!');
                return;
            } catch (error) {
                console.error(error);
            }
            

        // WITH FILE
        } else if(option === '2'){
            const csv = require('csv-parser');
            const filePath = (await question('Enter the csv file path(right click and properties): ')).trim();

            if(!fs.existsSync(filePath)){
                console.log('❌ File not found. Please check the path and try again.');
                return;
            }

            let orders = [];

            fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Each row is an order
                let newOrder = {
                    sender_name: row.sender_name,
                    sender_phone: row.sender_phone,

                    buyer_name: row.buyer_name,
                    buyer_phone: row.buyer_phone,
                    buyer_city: row.buyer_city,
                    buyer_village: row.buyer_village,
                    buyer_adress: row.buyer_adress,
                    price_per_order: Number(row.price_per_order),
                    shipping_fee: 150,
                    whos_paying: row.whos_paying
                };
                orders.push(newOrder);
            })
            .on('end', () => {
                orders.forEach(order => saveOrder(order));
                console.log(`✅ ${orders.length} orders added successfully from file!`);
            })
            .on('error', (err) => {
                console.error('❌ Error reading the CSV file:', err.message);
            });


        } else{
            console.log('❌ Incorrect! You must enter a number 1 or 2!');
            continue;
        }
    }
    
}


// Listing orders
async function listOrders() {
    try {
        console.log('Here are all your orders:\n')
        const data = fs.readFileSync(ordersFile, 'utf-8'); // read the file
        const orders = JSON.parse(data); // parse it

        if(orders.length === 0){
            return 'No orders created!';
        }

        orders.forEach((order,index) => {
            console.log(`\n📦 Order #${index+1}`);
            console.log(`Sender: ${order.sender_name} - ${order.sender_phone}`);
            console.log(`Buyer: ${order.buyer_name} - ${order.buyer_phone}`);
            console.log(`City: ${order.buyer_city}, Adress: ${order.buyer_adress}`);
            console.log(`Village: ${order.buyer_village}`);
            console.log(`Price: ${order.price_per_order} denars`);
        });
    } catch (error) {
        console.error('❌ Could not load users: ' + error.message);
    }
    
}

// About us(text)
async function aboutUs() {
console.log(`Brza Pratka is a fast and reliable shipping company based in Macedonia, dedicated to delivering parcels quickly, safely, and affordably across the country. Whether you're sending documents, online store packages, or personal deliveries, our mission is to make shipping simple and stress-free. With a team of experienced couriers and a growing logistics network, we ensure your package arrives on time, every time. At Brza Pratka, we value trust, transparency, and efficiency. Choose us for same-day delivery options, easy tracking, and professional service you can count on. Your package is our priority.`)
}


// EXPORTS
module.exports = { createOrder, listOrders, aboutUs };