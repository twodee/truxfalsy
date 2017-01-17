all: none

# Zer0es iZ oneZ

db:
	mysql -u truxfalsy_user -p truxfalsy

schema:
	mysql -u truxfalsy_user -p truxfalsy < schema.sql
