mkdir data
node scripts/initializeDB.js data/adda.db 
mkdir test/data
node scripts/initializeDB.js test/data/adda.db
sqlite3 test/data/adda.db < scripts/insertData.sql
sqlite3 data/adda.db < scripts/insertNewTables.sql
sqlite3 test/data/adda.db < scripts/insertNewTables.sql
cp test/data/adda.db test/data/adda.db.backup