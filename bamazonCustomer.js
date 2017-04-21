// require node packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var prompt = require('prompt');

//connection to the database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "$w33t",
  database: "bamazon"
});
//making sure i have a connection to the database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

  });

//selecting all of the products in the table
var runSearch = function() {
    connection.query('SELECT * FROM products', function(err, res, fields) {

// instantiate 
var table = new Table({
    head:['Item ID', 'Product', 'Department', 'Price', 'Quantity']
 
});
 
// this it the item array

for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name,
              res[i].price, res[i].stock_quantity
            ]);
}
 
console.log(table.toString());

        //which item would you like to buy
        inquirer.prompt({
            name: "choice",
            type: "list",
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
                console.log(choiceArray);
            },
            message: "Which item would you like to buy?"
    }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {
                    var chosenItem = res[i];

                    // how many items would you like to buy
                    inquirer.prompt({
                        name: "number",
                        type: "input",
                        message: "How many would you like to purchase?"
                    }).then(function(answer) {

                        //checking the datbase to see if there is enough of the item you want to buy
                        if (chosenItem.stock_quantity < parseInt(answer.number)) {
                        
                          console.log('Insufficient Quantity');
                           
                        } else {
                          var amount = parseInt(answer.number);

                          //updating the database 
                          connection.query("UPDATE Products SET ? WHERE ?", [{
                                stock_quantity: (chosenItem.stock_quantity-amount)
                            }, {
                                product_name: chosenItem.product_name
                            }], function(err, res) {
                                console.log("Thank you for shopping with us!");
              });
                            //telling the customer the total of the order
                            console.log("Your total for "+parseInt(answer.number)+" "+chosenItem.product_name+ " is "+chosenItem.price*parseInt(answer.number));

                           
                        }
 

                    })
                }
            }
        })
    })
}

runSearch();