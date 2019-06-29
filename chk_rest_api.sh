#!/bin/bash

#insert 4 records
curl -s -d '{"text":"San Jose", "x":-121.886,"y":37.338}' -H 'Content-Type: application/json' http://localhost:3000/api/label/create
curl -s -d '{"text":"Seattle",  "x":-122.332,"y":47.606}' -H 'Content-Type: application/json' http://localhost:3000/api/label/create
curl -s -d '{"text":"Portland", "x":-122.676,"y":45.523}' -H 'Content-Type: application/json' http://localhost:3000/api/label/create
curl -s -d '{"text":"Boise",    "x":-116.215,"y":43.619}' -H 'Content-Type: application/json' http://localhost:3000/api/label/create


#insert 1 record with id
curl -s -d '{"id":5, "text":"Los Angeles", "x":-118.243,"y":34.0522}' -H 'Content-Type: application/json' http://localhost:3000/api/label/create

#update 1 record with id
curl -s -X PUT -d '{"id":5, "text":"Los Angeles, CA", "x":-118.243,"y":34.0522}' -H 'Content-Type: application/json' http://localhost:3000/api/label/create

curl -s -X PUT -d '{"id":5, "text":"Los Angeles, CA2", "x":-118.243,"y":34.0522}' -H 'Content-Type: application/json' http://localhost:3000/api/label/5

#delete 1 record with id
curl -s -X DELETE http://localhost:3000/api/label/5


#count records
curl -s http://localhost:3000/api/label/count

#fetch all records
curl -s http://localhost:3000/api/label

