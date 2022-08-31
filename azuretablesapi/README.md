
### To build the image 

`docker-compose up -d --build`

### To tear down 
`docker-compose down `

### To run the container
`docker run -it -v <completepathindevmachine>:<workingdirectoryindockerimage>:ro -v/app/node_modules -p 3800:3500 <imagename>`

### To see the logs 
`docker logs <containername>`

### To see in the file system of the container

`docker exec -t -i <containername> /bin/bash`

### With  multiple compose files

#####UP

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`

#####DOWN

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v`
