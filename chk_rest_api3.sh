#!/bin/bash

for ID in `curl -s "http://localhost:3000/api/label" | tr '}' '\n' | cut -d: -f2 | grep "," | cut -d, -f1`
do
    echo "deleting $ID ..."
    curl -s -X DELETE "http://localhost:3000/api/label/$ID"
done


