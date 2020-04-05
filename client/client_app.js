// const args = process.argv;
const fs = require('fs');
var grpc = require('grpc');
var weather = require('../server/proto/weather_pb');
var service = require('../server/proto/weather_grpc_pb');
import { sleep, getRPCDeadline } from '../utils/utils.js';


let credentials = grpc.credentials.createSsl(
    fs.readFileSync('./certs/ca.crt'),
    fs.readFileSync('./certs/client.key'),
    fs.readFileSync('./certs/client.crt')
)

var client = new service.WeatherServiceClient(
    'localhost:50051',
    credentials
);

/**
 * Unary API call to server
 * @param {WeatherServiceClient} client Defines the connection to the WeatherServiceClient
 * @param {WeatherRequest} request Defines the location of interest
 */
function callWeatherToday(client, request) {
    client.checkWeatherToday(request, {deadline: getRPCDeadline()}, (error, response) => {
        if (!error) {
            console.log('################## RESULT ##################');
            console.log(response.getResult());
            console.log("Temperature: " + response.getTodaystemperature() + "°C");
            console.log("Humidity: " + response.getHumidity() + "%");
            console.log('############################################');
        } else {
            console.log(error.code + ": " + error.message);
        }
    });
}

/**
 * Server Streaming Service
 * @param {WeatherServiceClient} client Defines the connection to the WeatherServiceClient
 * @param {WeatherRequest} request Defines the location of interest
 */
function callWeatherForecast(client, request) {

    var stream = client.checkWeatherForecast(request, () => (error, _) => {
        if (!error) {
            console.log("Stream setup sucessfully.");
        } else {
            console.log(error.code + ": " + error.message);
        }
    });
    
    stream
        .on('data', (response) => {
            console.log(response.getResult());
            console.log(response.getTodaystemperature());
            console.log(response.getHumidity());
        })
        .on('error', (err) => {
            console.log(`ERROR! ${err.details}`);
            throw Error('There seems to be a streaming Error.');
        })
        .on('end', () => {
            console.log("Stream ended.");
        });
}

/**
 * Client Streaming Service
 * @param {WeatherServiceClient} client Defines the connection to the WeatherServiceClient
 * @param {WeatherRequest} request Defines the location of interest
 */
function callWeatherAverage(client, requests) {

    var call = client.checkWeatherAverage(new weather.WeatherRequest(), (err, res) => {
        if (!err) {
            console.log('Server Response: ', res.getResult());
        } else {
            console.log(error.code + ": " + error.message);
        }
    });

    let count = 0, intervalID = setInterval(function () {
        console.log('Sending msg: ' + count);

        var request = new weather.WeatherRequest();
        request.setCity('Berlin');

        call.write(request);

        if(++count > 3) {
            clearInterval(intervalID);
            call.end(); 
        }
        
    }, 1000);    
}

/**
 * BiDirectional Streaming
 * @param {WeatherServiceClient} client Defines the connection to the WeatherServiceClient
 * @param {WeatherRequest} request Defines the location of interest
 */
async function callTemperature(client) {
    
    var call = client.checkTemperature(request, (error, response) => {
        !error ? console.log('Server response: ', response): console.log(error.code + ": " + error.message);
    });

    call
        .on('data', response => {
            console.log('Hello client! ' + response.getTempc());
        })
        .on('error', error => {
            console.log(error);
        })
        .on('end', () => {
            console.log('<CLIENT> The end.');
        });

    for(var i = 0; i < 5; i++) {
        var request = new weather.WeatherRequest();
        request.setCity('Rio de Janeiro');

        call.write(request);
        await sleep(1500);
    }

    call.end(); // end client side streaming
}


function main() {
    // Command Line Arguments
    var args = process.argv.slice(2);

    var forecastRequest = new weather.WeatherForecastRequest();
    forecastRequest.setRequest(request);
    forecastRequest.setForecastlength(3);
    
    // Set default case: London with unary API call
    if (!args.length) {
        args = ['callWeatherToday', 'London']
    }

    // Setup Request
    var request = new weather.WeatherRequest();
    request.setCity(args[1]).setCountry('UK');
    
    console.log(args[0]); // Specify API type
    switch (args[0]) {
        case 'callWeatherToday':    // Unary RPC
            callWeatherToday(client, request);
            break;
        case 'callWeatherForecast': // Server Streaming RPC
            callWeatherForecast(client, forecastRequest);
            break;
        case 'callWeatherAverage':  // Client Streaming RPC
            callWeatherAverage(client, request);
            break;
        case 'callTemperature':     // BiDirectional Streaming RPC
            callTemperature(client);
            break;
        default:
            console.log('Error!');
            break;
    }

}

main();