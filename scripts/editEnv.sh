cd ../cucumber/features/support/
sed -e "s/jenkins.$1/jenkins.$2/" env.rb > env.rb.bak; mv env.rb.bak env.rb