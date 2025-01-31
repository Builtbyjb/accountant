# Start frontend bash shell
fd:
	docker compose run --service-ports client bash

# Start backend bash shell
bd: 
	docker compose run --service-ports server bash

dw:
	docker compose down

up: 
	docker compose up --watch
