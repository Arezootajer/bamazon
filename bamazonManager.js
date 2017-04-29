var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
host:"localhost",
port:3306,
user:'root',
password:'root',
database :'Bamazon'
	
});
connection.connect(function(err){
	if(err) throw err;
	//console.log("connected as id" + connection.threadId);
	choices();
});

var choices = function(){
	inquirer.prompt([{

		type:'list',
		name:'action',
		message:'what would you like to do?',
		choices:[
		'View Products for Sale',
		'View Low Inventory',
		'Add to Inventory',
		'Add New Product'
		]

	}
	]).then(function(answer) {

		
		switch (answer.action) {
		    case "View Products for Sale":
		    	viewProducts();
		      	break;

		    case "View Low Inventory":
		    	viewLowInventory();
		      	break;

		    case "Add to Inventory":
		    	addInventory();
		      	break;

		    case "Add New Product":
		    	addProduct();
		      	break;
		}
	});
};



var viewProducts = function() {
	console.log("here");
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
		}

		
		choices();
	});
};


var viewLowInventory = function() {
	var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
	connection.query(query, function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Quantity: " + res[i].stock_quantity);
		}

		choices();
	});
};


var addInventory = function() {

	inquirer.prompt([
		{
			name: "product_ID",
			type: "input",
			message: "Enter product ID that you would like to add stock to."
		},
		{
			name: "quantity",
			type: "input",
			message: "How much stock would you like to add?"
		}
	]).then(function(answer) {

		
		connection.query("SELECT * FROM products", function(err, results) {
			
			var item;

			
			for (var i = 0; i < results.length; i++) {
				if (results[i].item_id === parseInt(answer.product_ID)) {
					item = results[i];
				}
			}

			console.log(item);
			var updatedQuantity = parseInt(item.stock_quantity) + parseInt(answer.quantity);

			console.log("Updated stock: " + updatedQuantity);

			
			connection.query("UPDATE products SET ? WHERE ?", [{
				stock_quantity: updatedQuantity
			}, {
				item_id: answer.product_ID
			}], function (err, res) {
				if (err) {
					throw err;
				} else {

					choices();
				}
			});
			
		});

	});
};

var addProduct = function() {
	inquirer.prompt([{
		name: "product_name",
		type: "input",
		message: "What is the product you would like to add?"
	}, {
		name: "department_name",
		type: "input",
		message: "What is the department for this product?"
	}, {
		name: "price",
		type: "input",
		message: "What is the price for the product, e.g. 25.00?"
	}, {
		name: "stock_quantity",
		type: "input",
		message: "How much stock do you have to start with?"
	}]).then(function(answer) {
		connection.query("INSERT INTO products SET ?", {
			product_name: answer.product_name,
			department_name: answer.department_name,
			price: answer.price,
			stock_quantity: answer.stock_quantity
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Your product was added successfully!");

				
				
			}
		});
	});
};

