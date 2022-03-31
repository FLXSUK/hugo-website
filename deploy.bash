#!/bin/bash

rm -rf public/*
hugo -D
aws --profile paul s3 sync public s3://www.flxs.co.uk --delete
