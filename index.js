//Assignment 9
//Add logging for each operation there should 
//not be any console.log in your application
//apply respestive logges in your application

//import fs module
let fs = require("fs");
//import readline module
let readline = require("readline");
//import log4js module for logging functionality
let log4js = require("log4js");



//Required variable declarations for performing the operation
let lineno = 0;
let rl;

//Array to store the resultant list
let countries = [];

let logger, readFile;

let filename = "data/country_details.csv";

let run = function () 
{
	//configure log4js.conf.json file (file name is log4js.conf.json)
	log4js.configure("log4js.conf.json");
	//create an object of logger
	logger = log4js.getLogger("index");



	//Error handling - check if file exists or not before processing the file.
	
	//by using fs.stat if err == null call 
	//readFile method
	fs.stat(filename, function(err, stats)
	{
	if(err == null)
	{
		logger.info("CSV File exists");
		//call readFile();
		readFile();
	}else 
	if(err.code == "ENOENT")
	{
		logger.error("File doesn't exists " + err);
	}
	else
	{
		logger.error("other error occured" + err);
	}

	});

	//Create supporting function to add Population data to object	
	function populationData(population)
	{
	this.populationData = population;
	}
	//Create supporting function to add GDP data to object
	function gdpData(gdp)
	{
	this.gdpData = gdp;
	}
	//Create supporting function to add GDP per capita income data to object
	function gdpincomeData(gdpincome)
	{
	this.gdpincomeData = gdpincome;
	}
	//Create supporting function to add GDP based on purchasing power parity data to object
	function gdppppData(gdpppp)
	{
	this.gdppppData = gdpppp;
	}
	//Create class that helps to create instance of objects to hold data
	function country(countryname, area)
	{
	this.countryname = countryname;
	this.area = area;
	this.populationData = populationData;
	this.gdpData = gdpData;
	this.gdpincomeData = gdpincomeData;
	this.gdppppData = gdppppData;
	}
	//Create function to store filtered data into array. 
	//This will store all countries objects into an array.
	function populateCountriesData(curdata)
	{
		countries.push(curdata);
	}
	//Create function to access a specific country data and display 
	//the contents on console.
	function getCountryData(countryname)
	{
		for(let i=0; i<countries.length; i++)
		{
			if(countries[i].countryname == countryname)
			{
				return countries[i];
			}

		}
	}
	//Create function to update area data of a specific country.
	function setCountryArea(countryname, newArea)
	{
		for(let i=0; i<countries.length; i++)
		{
			if(countries[i].countryname == countryname)
			{
				countries[i].area=newArea;
				break;
			}
		}
	}

//}
//Create function to read line using readline library and process the contents to filter and create objects for the data.
readFile = function readFile()
{
	////Create readline interface using createInterface method to read the CSV file 
	rl = readline.createInterface(
	{
		input:fs.createReadStream(filename)

	});

	logger.debug("File read");

	rl.on("error", function()
	{
		logger.error("Error occured");
	});

	rl.on("line", function(line) 
	{
			 

   //create object(for ex.name can be - countryObject) of the class country(countryname,area)
   let lineRecords = line.trim().split(",");
	if(lineno>0)
	{
		let countryname = lineRecords[0].replace(/"/g,"");
		let area = lineRecords[1].replace(/"/g,"");
		let newcountry = new country(countryname, area);
    //read from csv file Population2010 till population2015 and store it in populationData array
	//let populationData = [];
	let populationData1 = [];
  	for(let index=2; index<=7; index++)
  	{
    	populationData1.push(parseFloat(lineRecords[index]));
  	}
	//read from csv file GDP2010 till GDP2015 and store it in gdpData array
	let gdpData1 = [];
  	for(let index=8; index<=13; index++)
  	{
   		gdpData1.push(parseFloat(lineRecords[index]));
  	}
	//read from csv file 'GrossDomesticProduct2010' till 'GrossDomesticProduct2015' and store it in gdpincomeData array
	let gdpincomeData1 = [];
  	for(let index=14; index<=19; index++)
  	{
    	gdpincomeData1.push(parseFloat(lineRecords[index]));
  	}
    //read from csv file PPP2010 till PPP2015 and store it in gdppppData array
    let gdppppData1 = [];
  	for(let index=20; index<=25; index++)
  	{
    	gdppppData1.push(parseFloat(lineRecords[index]));
 	}

 	
 	newcountry.populationData(populationData1);
    newcountry.gdpData(gdpData1);
    newcountry.gdpincomeData(gdpincomeData1);
    newcountry.gdppppData(gdppppData1);

    populateCountriesData(newcountry);

	}

	lineno++;

	});
	//call supporting function on the object created (for ex.name can be - countryObject)
    //and pass appropriate variables
   	  
    

     //pass the object(countryObject) to the global array (countries) by calling 
    //populateCountriesData



//Handle the post processing functionality after file read is complete

try
{
	rl.on("close",function()
	{
	 //manipulate the country data using set method declared above
	 //(for ex - modify area of 'India' to 1000)
   		setCountryArea('India', 1000);
	  //use get method to retrive the country object for India and store it 
	  //in a varaible
   
  		let countrydata = getCountryData('India');
  
	
							
		//Convert countries object to JSON
		// string
		let jsonData =  JSON.stringify(countries);

		//write JSON string into a the output file
		fs.writeFile("output/datafile.json", jsonData, "utf8", function(err)
		{
		logger.info("json file written");	
		});

	});
}
catch(err)
{
	logger.error("Error occured:" + err.stack);
}
}
}	
run();
module.exports = {
	exec: run,
	countries: countries,
	log4js : log4js,
	readFile: readFile,
	logger: logger
}
