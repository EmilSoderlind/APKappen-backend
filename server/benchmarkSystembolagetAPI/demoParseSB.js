let request = require('request');
const plotlib = require('nodeplotlib')
//let Plot = require('nodeplotlib/Plot')

//import { plot, Plot } from 'nodeplotlib';

let testURL = "https://www.systembolaget.se/dryck/roda-viner/14-hands-7246701"

let numberOfParses = 0;

let parsing = [];
let times = [];

let burstStartDate;

function makePlot(){
    const data = [{x: parsing, y: times, type: 'line'}];
    plotlib.plot(data);
}

function parse(){

    let currentRequestDate = new Date()

    request({ url: testURL}, function (error, response, body) {

        
        if (!error && response.statusCode == 200) {
    
            //console.log("Got: " + JSON.stringify(response))            

            numberOfParses += 1;
            //console.info('Elapsed burst time: %dms', new Date() - burstStartDate)
            console.log(numberOfParses)
            //console.log("Curr time: %dms", new Date() - currentRequestDate)
            parsing.push(numberOfParses)
            times.push(new Date() - currentRequestDate)
            
            parse();
    
        }else if(response == undefined){
            console.log("Response == undefined")
            console.info('Elapsed burst time: %dms', new Date() - burstStartDate)
            console.log("numberOfParses: " + numberOfParses)
            console.log("error: " + error)
            console.log("response: " + response)

            console.log("Retry!")
            parse()
            
        }else{
            console.info('Elapsed burst time: %dms', new Date() - burstStartDate)
            console.log("numberOfParses: " + numberOfParses)
            
            console.log("ERROR in parsing: \n" + response.statusCode + "-" + error)
            console.log(response.body)
        }
      });

}

function main(){

    burstStartDate = new Date();
    parse()



}

main()

