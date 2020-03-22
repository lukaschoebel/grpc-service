var grpc = require('grpc');
var weather = require('../server/proto/weather_pb');
var service = require('../server/proto/weather_grpc_pb');

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

function main() {
    var client = new service.WeatherServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );
    
    // Setup Request
    var request = new weather.WeatherRequest();
    request.setCity('London').setCountry('UK');

    // callWeatherToday(client, request);

    var forecastRequest = new weather.WeatherForecastRequest();
    forecastRequest.setRequest(request);
    forecastRequest.setForecastlength(3);

    callWeatherForecast(client, forecastRequest);

}

main();