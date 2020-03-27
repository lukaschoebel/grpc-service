const fs = require('fs');
var grpc = require('grpc');
const request = require('request');
var weather = require('./proto/weather_pb');
var service = require('./proto/weather_grpc_pb');
import { API_KEY } from '../secrets/secrets.js';
import { sleep, isString } from '../utils/utils.js';

function convertF2C(fahrenheit) {
    return (( fahrenheit - 32 ) * 5 / 9).toFixed(2);
}

function getWeatherFor(city) {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    let weatherJSON = new JSON();

    request(url, function (err, response, body) {
        if(!err){
            weather = JSON.parse(body);
            console.log(weather.main);
            return weather.main;
        } else {
            console.log('error:', error);
            return null;
        }
    });

    return null;

}

function checkWeatherToday(call, callback) {
    
    var city = call.request.getCity();

    // TODO: Check if Weather API yields a result for the specified *city*
    // FIXME: isString not sufficient since req.getCity() will always yield string result
    if (isString(city)) {
        console.log("city > " + city);
        
        var currentWeather = getWeatherFor(city);
        console.log("-->" + currentWeather);
        
        var weatherResponse = new weather.WeatherResponse();
        
        weatherResponse.setResult(
            `It's always sunny in ${city}, ${call.request.getCountry()}`
        );
    
        weatherResponse.setTodaystemperature(
            `Temperature: ${weather.temp} °C.`
        );
    
        weatherResponse.setHumidity(
            "Humidity: 110."
        );

        callback(null, weatherResponse);
    } else {
        // Error Handling
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: city + ' does not seem to be a valid city. Please ensure correct spelling and data format.'
        });
    }


}

function checkWeatherForecast(call, callback) {
    var city = call.request.getRequest().getCity();
    var forecastLength = call.request.getForecastlength();
    
    let count = 0, intervalID = setInterval(function() {        
        var weatherForecastResponse = new weather.WeatherResponse();
    
        weatherForecastResponse.setResult(`It's always sunny in ${city}, ${count+1}/${forecastLength}`);
        weatherForecastResponse.setTodaystemperature("Temperature: 25°C.");
        weatherForecastResponse.setHumidity("Humidity: 110.");
    
        call.write(weatherForecastResponse);

        if(++count > forecastLength - 1) {
            clearInterval(intervalID);
            call.end(); // send all messages
        }
    
    }, 1000)
}

function checkWeatherAverage(call, callback) {
    call
        .on('data', request => {
            var city = request.getCity();
            // TODO: Check Weather in ALL CITIES
            
            // Executed when data is received @ server
            console.log('Weather Call: ' + city);
        })
        .on('error', error => {
            console.log(error);
        })
        .on('end', () =>{
            var response = new weather.TemperatureAverage();
            // TODO: Compute average and return as response

            response.setResult('42°C');

            callback(null, response);
        });
}

async function checkTemperature(call, callback) {
    call
        .on('data', response => {
            var city = response.getCity();
            console.log('city name is: ', city);
        })
        .on('error', error => {
            console.log(error);
        })
        .on('end', () => {
            console.log('<SERVER> The end.');            
        });
    
    for (let i = 0; i < 4; i++) {
        var request = new weather.Temperature()
        // TODO: Integrate Logic to actually convert temperature scales
        request.setTempc('20°C');
        request.setTempf('68 F');
        request.setTempk('293.15 K');

        call.write(request);

        await sleep(1000);
    }

    call.end() // end server side streaming
}

function main() {

    let credentials = grpc.ServerCredentials.createSsl(
        fs.readFileSync('./certs/ca.crt'), [{
            cert_chain: fs.readFileSync('./certs/server.crt'),
            private_key: fs.readFileSync('./certs/server.key')
        }], true
    )

    var server = new grpc.Server();
    server.addService(service.WeatherServiceService, {
        checkWeatherToday: checkWeatherToday, 
        checkWeatherForecast: checkWeatherForecast,
        checkWeatherAverage: checkWeatherAverage,
        checkTemperature: checkTemperature
    });

    server.bind('127.0.0.1:50051', credentials);
    server.start();
    console.log('Server running on port 127.0.0.1:50051', credentials);

}

main()