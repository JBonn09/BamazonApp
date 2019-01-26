var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
 host: "localhost",
 port: 3000,
 user: "root",
 password: "",
 database: "bamazon_DB"
});

connection.connect(function(err){
   if (err) throw err;

   buyProduct();
});

function buyProduct() {

   connection.query("SELECT * FROM products", function(err, results) {
     if (err) throw err;
     inquirer
       .prompt([
         {
           name: "choice",
           type: "rawlist",
           choices: function() {
             var choiceArray = [];
             for (var i = 0; i < results.length; i++) {
               choiceArray.push(results[i].product_name +  ", $"+results[i].price + ", quantity:"+ results[i].stock_quantity);
             }
             return choiceArray;
           },
           message: "What product would you like to buy (enter ID number)?"
         },
         {
           name: "amount",
           type: "input",
           message: "How many would you like to buy?"
         }
       ])
       .then(function(answer) {
         
         var chosenItem = [];
         for (var i = 0; i < results.length; i++) {

           if (results[i].product_name === answer.choice.substr(0, answer.choice.indexOf(','))) {
             if (results[i].stock_quantity > parseInt(answer.amount)) {
            
               connection.query(
                 "UPDATE products SET ? WHERE ?",
                 [
                   {
                     stock_quantity: results[i].stock_quantity-answer.amount
                   },
                   {
                     id: results[i].id
                   }
                 ],

                 function(error) {
                   if (error) throw err;
                   console.log("Thanks for your purchase");
                   buyProduct();
                 }
               );
             }
             else {
             
              
               buyProduct();
             }
           
           }
         }
         

       });
   });
 }