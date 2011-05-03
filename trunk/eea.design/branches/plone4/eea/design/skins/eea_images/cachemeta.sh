#!/bin/bash
# bulk creation .metadata files for images with HTTPCache settings. 
# change the extension for the files you want to handle
FILES=*.png
for f in $FILES
do
  echo "Processing $f file..."
  # take action on each file. $f store current file name
  # create a metadata file for each image
  metafile=$( echo "$f.metadata" )  
  echo "$metafile"
  cat cachemeta.template > $metafile
  #touch 
  #cat $f
done
