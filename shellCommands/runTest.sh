sh shellCommands/deleteDB.sh
sh shellCommands/initdb.sh
npm run test 2>error
a=`cat error | wc -c`

if [ $a == 0 ]
	then
		echo "success"
	else
		rm -rf error
		for (( ; ; ))
		do
			echo -e "\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a\a"
		done	
fi

rm -rf error