#!/bin/bash

#fetch all records starting with 'S'
curl -s "http://localhost:3000/api/label?text=S%"
echo ""

curl -s "http://localhost:3000/api/label?limit=2&offset=1"
echo ""


curl -s "http://localhost:3000/api/label"
echo ""

