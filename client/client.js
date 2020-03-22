var grpc = require('grpc');
var weather = require('../server/proto/weather_pb');
var service = require('../server/proto/weather_grpc_pb');

function main() {
    var client = new service.WeatherServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );
    
    // Setup Request
    var request = new weather.WeatherRequest();
    request.setCity('London').setCountry('UK');

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

main();