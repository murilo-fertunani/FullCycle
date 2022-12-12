FROM golang:1.19-alpine as build

WORKDIR /usr/src/appdo
   
COPY . .

ENV CGO_ENABLED=0

RUN GOOS=linux go build -o /fullcycle

FROM scratch

WORKDIR /usr/src/app

COPY --from=build /fullcycle /fullcycle

ENTRYPOINT ["/fullcycle"]