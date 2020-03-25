var grpc = require('grpc');
var weather = require('../server/proto/weather_pb');
var service = require('../server/proto/weather_grpc_pb');
import { sleep } from '../utils/utils.js';

// UNARY
function callWeatherToday(client, request) {
    client.checkWeatherToday(request, (error, response) => {
        if (!error) {
            console.log('################## RESULT ##################');
            console.log(response.getResult());
            console.log(response.getTodaystemperature());
            console.log(response.getHumidity());
            console.log('############################################');
        } else {
            console.log(error);
        }
    });
}

function callWeatherForecast(client, request) {

    var stream = client.checkWeatherForecast(request, () => {});
    
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

function callWeatherAverage(client, requests) {

    var call = client.checkWeatherAverage(new weather.WeatherRequest(), (err, res) => {
        if (!err) {
            console.log('Server Response: ', res.getResult());
        } else {
            console.error(error);
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

async function callTemperature(client) {
    
    var call = client.checkTemperature(request, (error, response) => {
        console.log('Server response: ', response);
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
    var client = new service.WeatherServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );
    
    // Setup Request
    var request = new weather.WeatherRequest();
    request.setCity('London').setCountry('UK');

    // Unary RPC
    // callWeatherToday(client, request);

    var forecastRequest = new weather.WeatherForecastRequest();
    forecastRequest.setRequest(request);
    forecastRequest.setForecastlength(3);

    // Server Streaming RPC
    // callWeatherForecast(client, forecastRequest);

    // Client Streaming RPC
    // callWeatherAverage(client, request);

    // BiDirectional Streaming RPC
    callTemperature(client);
}

main();