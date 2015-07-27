run:
	python -m SimpleHTTPServer

install:
	npm install --global babel

build:
	babel src --out-dir scripts

watch:
	babel src --watch --out-dir scripts