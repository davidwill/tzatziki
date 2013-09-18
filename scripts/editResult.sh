cd ../app/results/
sed -i -e '/^Testing App/d' $1.html
sed -i -e '/^Using local/d' $1.html&