var grpc = require('grpc');
var weather = require('../server/proto/weather_pb');
var service = require('../server/proto/weather_grpc_pb');

// Implementation of RPC Method
function checkWeatherToday(call, callback) {
    var weatherResponse = new weather.WeatherResponse();
    
    weatherResponse.setResult(
        `It's always sunny in ${call.request.getLocation().getCity()}, ${call.request.getLocation().getCountry()}`
    );

    weatherResponse.setTodaystemperature(
        "Temperature: 25°C."
    );

    weatherResponse.setTodaysuvindex(
        "UV-Index: 1."
    );

    callback(null, weatherResponse);

}

function main() {
    var server = new grpc.Server();
    server.addService(service.WeatherServiceService, {checkWeatherToday: checkWeatherToday})

    server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('Server running on port 127.0.0.1:50051');

}

main()