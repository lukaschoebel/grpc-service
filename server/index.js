var grpc = require('grpc');
var weather = require('../server/proto/weather_pb');
var service = require('../server/proto/weather_grpc_pb');

function convertF2C(fahrenheit) {
    return (( fahrenheit - 32 ) * 5 / 9).toFixed(2);
}

// Implementation of RPC Method
function checkWeatherToday(call, callback) {
    var weatherResponse = new weather.WeatherResponse();
    
    weatherResponse.setResult(
        `It's always sunny in ${call.request.getCity()}, ${call.request.getCountry()}`
    );

    weatherResponse.setTodaystemperature(
        "Temperature: 25°C."
    );

    weatherResponse.setHumidity(
        "Humidity: 110."
    );

    callback(null, weatherResponse);

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

        if(++count > forecastLength-1) {
            clearInterval(intervalID);
            call.end(); // send all messages
        }
    
    }, 1000)
    

}

function main() {
    var server = new grpc.Server();
    server.addService(
        service.WeatherServiceService, 
        {checkWeatherToday: checkWeatherToday, checkWeatherForecast: checkWeatherForecast}
    );

    server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('Server running on port 127.0.0.1:50051');

}

main()