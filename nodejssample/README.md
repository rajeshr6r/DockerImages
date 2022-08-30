
### To build the image 

`docker-compose up -d --build`

### To tear down 
`docker-compose down `

### To run the container
`docker run -it -v <completepathindevmachine>:<workingdirectoryindockerimage>:ro -v/app/node_modules -p 3800:3500 <imagename>`
