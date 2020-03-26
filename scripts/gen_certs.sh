# kudos to G. Behamondez
# Link: https://github.com/gbahamondezc/node-grpc-ssl/blob/master/scripts/gen_certs.sh

CERT_DIR=./certs
echo "Creating certs folder ..."
if [ ! -d "$CERT_DIR" ]; then
    mkdir certs
    echo "Created directory: $CERT_DIR"
else 
    echo "$CERT_DIR does already exist."
fi

cd certs

echo "Generating certificates ..."
openssl genrsa -passout pass:1111 -des3 -out ca.key 4096
openssl req -passin pass:1111 -new -x509 -days 365 -key ca.key -out ca.crt -subj  "/C=CL/ST=RM/L=Santiago/O=Test/OU=Test/CN=ca"
openssl genrsa -passout pass:1111 -des3 -out server.key 4096
openssl req -passin pass:1111 -new -key server.key -out server.csr -subj  "/C=CL/ST=RM/L=Santiago/O=Test/OU=Server/CN=localhost"
openssl x509 -req -passin pass:1111 -days 365 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt
openssl rsa -passin pass:1111 -in server.key -out server.key
openssl genrsa -passout pass:1111 -des3 -out client.key 4096
openssl req -passin pass:1111 -new -key client.key -out client.csr -subj  "/C=CL/ST=RM/L=Santiago/O=Test/OU=Client/CN=localhost"
openssl x509 -passin pass:1111 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt
openssl rsa -passin pass:1111 -in client.key -out client.key
echo "🚀 Finished generating certificates."