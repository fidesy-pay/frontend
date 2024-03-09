

APP_NAME=frontend-stage

clean:
	if docker inspect ${APP_NAME} > /dev/null 2>&1; then docker rm -f ${APP_NAME} && docker rmi -f ${APP_NAME}; else echo "Container not found."; fi

run:
	make clean
	export PORT=4000
	docker build --tag ${APP_NAME} .
	docker run --name ${APP_NAME} -d \
            --network zoo \
            -e PORT=4000 -p 4000:4000 \
            ${APP_NAME}