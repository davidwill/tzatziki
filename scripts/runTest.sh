cd ../cucumber/
cucumber --tags @$1 -f html > ../app/results/$1.html&
