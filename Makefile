.PHONY: test build dev start lint lint-cms

test:
	npm test

build:
	npm run build

dev:
	npm run dev

start:
	npm run start

lint:
	npm run lint

lint-cms:
	npm run lint:cms
