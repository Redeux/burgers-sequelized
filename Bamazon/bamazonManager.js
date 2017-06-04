"use strict";
const DB = require("./DBInstance.js"),
    promptly = require("promptly"),
    mysql = require("mysql"),
    dbConfig = require("./db.json");

menu()

function menu() {
    promptly.choose("\n Enter one of the following: \n  1 - View all products currently for sale \n  2 - View low inventory items \n  3 - Add more stock to an inventory item \n  4 - Add a new product to the store \n  Q - Quit \n:", ['1', '2', '3', '4', 'Q', 'q'], function(err, value) {
        switch (value) {
            case '1':
                viewAllProducts(false);
                break;
            case '2':
                viewLowInventory();
                break;
            case '3':
                viewAllProducts(true);
                break;
            case '4':
                addItem();
                break;
            case 'q':
            case 'Q':
                break;
        }
    });
}

function viewAllProducts(stockupdate) {
    const dbInstance = new DB();
    dbInstance.connect();

    dbInstance.select("*", "products", (error, response) => {
        if (error) throw error;
        console.log("\n");
        console.log('Displaying all products currently for sale ...');
        console.log("\n");
        console.log("| " + "ID" + " " + " | " + "Department" + " ".repeat(15) + " | " + "Product" + " ".repeat(18) + " | " + "Price" + " ".repeat(3) + " | " + "Stock" + "   |");
        console.log("-".repeat(84));
        for (let i = 0; i < response.length; i++) {
            console.log("| " + response[i].id + " ".repeat(3 - response[i].id.toString().length) + " | " + response[i].department_name + " ".repeat(25 - response[i].department_name.length) + " | " + response[i].product_name + " ".repeat(25 - response[i].product_name.length) + " | " + "$" + response[i].price + " ".repeat(7 - response[i].price.toString().length) + " | " + response[i].stock_quantity + " ".repeat(7 - response[i].stock_quantity.toString().length) + " |");
        }
        console.log("-".repeat(84));
        console.log("\n");
        if (stockupdate) return addStock();
        return menu();
    });

    dbInstance.end();
}

function viewLowInventory() {
    const dbInstance = new DB();
    dbInstance.connect();
    dbInstance.selectWhere("*", "products", "stock_quantity", "5", (error, response) => {
        if (error) throw error;
        console.log("\n");
        console.log('Displaying low invtentory products ...');
        console.log("\n");
        console.log("| " + "ID" + " " + " | " + "Department" + " ".repeat(15) + " | " + "Product" + " ".repeat(18) + " | " + "Price" + " ".repeat(3) + " | " + "Stock" + "   |");
        console.log("-".repeat(84));
        for (let i = 0; i < response.length; i++) {
            console.log("| " + response[i].id + " ".repeat(3 - response[i].id.toString().length) + " | " + response[i].department_name + " ".repeat(25 - response[i].department_name.length) + " | " + response[i].product_name + " ".repeat(25 - response[i].product_name.length) + " | " + "$" + response[i].price + " ".repeat(7 - response[i].price.toString().length) + " | " + response[i].stock_quantity + " ".repeat(7 - response[i].stock_quantity.toString().length) + " |");
        }
        console.log("-".repeat(84));
        console.log("\n");
        dbInstance.end();
        return menu();
    });
}

function addStock() {
    promptly.prompt('Enter an item ID: ', (error, value) => {
        if (error) throw error;
        const itemId = value;
        promptly.prompt('Stock quantity to add: ', (error, value) => {
            if (error) throw error;
            const stock = value;
            const connection = mysql.createConnection(dbConfig);
            connection.connect(error => {
                if (error) throw error;
                console.log("\n");
                console.log('Updating stock for product ID ' + itemId + ' ...');
                connection.query('UPDATE products SET ?? = ?? + ? WHERE id = ?', ["stock_quantity", "stock_quantity", stock, itemId], (error, response) => {
                    if (error) throw error;
                    console.log('Update Sucessful!');
                    console.log("\n");
                    connection.end();
                    return menu();
                });
            });
        });
    });
}

function addItem() {
    promptly.prompt('New Product Name: ', (error, value) => {
        if (error) throw error;
        const name = value;
        promptly.prompt('Department Name: ', (error, value) => {
            if (error) throw error;
            const department = value;
            promptly.prompt('Price: ', (error, value) => {
                if (error) throw error;
                const price = parseFloat(value);
                if (isNaN(price)) {
                    console.log('Error: Price must be a number');
                    return menu();
                }
                promptly.prompt('Stock Quantity: ', (error, value) => {
                    if (error) throw error;
                    const stock = parseFloat(value);
                    if (isNaN(stock)) {
                        console.log('Error: Stock must be a number');
                        return menu();
                    }
                    const connection = mysql.createConnection(dbConfig);
                    connection.connect(error => {
                        if (error) throw error;
                        console.log("\n");
                        console.log('Creating new product: ' + name + ' ...');
                        const newRow = {
                        	"product_name": name,
                        	"department_name": department,
                        	"price": price,
                        	"stock_quantity": stock
                        };
                        connection.query('INSERT INTO products SET ?', newRow, (error, response) => {
                            if (error) throw error;
                            console.log('Update Sucessful!');
                            console.log("\n");
                            connection.end();
                            return menu();
                        });
                    });
                });
            });
        });
    });
}
