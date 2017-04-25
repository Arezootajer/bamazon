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
	console.log("connected as id" + connection.threadId);
});

//display all of the items available for sale
//var userData= {name:"let it go", year:2013};
connection.query('select * from products', function(err,res){
	if (err) throw err;
	//console.log(res);
	for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " +
						res[i].product_name + " || Price: " + res[i].price);
		}
		askproduct();
});

var askproduct = function(){
	inquirer.prompt([{
		name:"productID",
		type:"input",
		message:"Please enter productID for product you want.",
		validate:function(value){
			if (isNaN(value)==false){
				return true;
			}
			return false;
		}
	},{
		name:"units",
		type:"input",
		message:"How many units do you want?",
			validate:function(value){
			if (isNaN(value)==false){
				return true;
			}
			return false;
		}	

	}]).then(function(answer){


		var query="select price,stock_quantity from products where ?";
		connection.query(query,{item_id:answer.productID},function(err,res){
			if (err) throw err;
			//console.log(res);
			
			var productPrice=res[0].price;
			var stockAvailable = res[0].stock_quantity;

			if (stockAvailable >= answer.units){

				order(productPrice,stockAvailable,answer.productID, answer.units);
				
			}else {
				console.log("Insufficient quantity!");
				askproduct();
			}
		});


	});
};


var order = function(price,availablestock , selectedID, selectedUnits){

	var stockupdate = availablestock -selectedUnits;
	var totalprice = selectedUnits*price;
	var query = "update products set ? where ?";
	connection.query(query,[{
		stock_quantity:stockupdate
	},{
		item_id:selectedID
	
	}],function(err,res){
		if(err) throw err;
		console.log("your purchase is done! you should pay:" +totalprice );

	})
}