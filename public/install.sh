#!/bin/sh  
spm build -f
grunt -f 

mv -f ./views ../views/output
