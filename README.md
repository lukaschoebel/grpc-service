# GRPC Microservice Demo

This is an example service to get comfortable with building a microservice based on the gRPC protocol and Protocol Buffers.

## Background

As an alternative to the common JSON format, Protocol Buffers are a condensed data format which support gRPC calls. Compared to REST(ful) APIs which uses HTTP 1.1, the gRPC protocol utilizes faster and safer HTTP 2 calls. While REST APIs provide CRUD (Create, Retrieve, Update, Delete) processes, gRPC is asynchronous and more flexible by providing four different options of streaming data. In general, it is possible to make *unary* gRPC calls, *server side* streaming, *client side* streaming and *bidirectional* streaming.

## Compling

The compilation of Protocol Buffers can be conducted statically by pre-processing or dynamically by loading and parsing the `.proto` file at runtime.

```bash
protoc -I=. ./proto/weather.proto \
  --js_out=import_style=commonjs,binary:./server \
  --grpc_out=./server \
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
```

While the statical compilation is executed as above, the dynamic conversion requires some additional setup and a package that can be installed with `npm install @grpc/proto-loader`.

## Helpful Resources

- [Official gRPC Node Documentation](https://grpc.io/docs/tutorials/basic/node/)
- [Official gRPC Java Documentation](https://grpc.io/docs/tutorials/basic/java/)
- [Official Protobuf Documentation](https://developers.google.com/protocol-buffers)