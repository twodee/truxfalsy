all: none

db:
	mysql -u truxfalsy_user -p truxfalsy

schema:
	mysql -u truxfalsy_user -p truxfalsy < schema.sql

deps:
	wget --no-clobber https://raw.github.com/urin/jquery.balloon.js/master/jquery.balloon.min.js
	wget --no-clobber https://raw.githubusercontent.com/js-cookie/js-cookie/latest/src/js.cookie.js
	chmod g+r js.cookie.js jquery.balloon.min.js
