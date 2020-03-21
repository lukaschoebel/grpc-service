var grpc = require('grpc');
var services = require('../server/proto/weather_grpc_pb');

function main() {
    var client = services.WeatherServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    );
}

main()