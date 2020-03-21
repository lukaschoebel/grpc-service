# GRPC Demo

This is an example service to get comfortable with building a microservice based on the gRPC protocol.

## Important Command

```bash
protoc -I=. ./proto/weather.proto \
  --js_out=import_style=commonjs,binary:./server \
  --grpc_out=./server \
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
```
