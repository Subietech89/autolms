# Stage 1: Build the Vite React Frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: PocketBase Backend + Serving Frontend
FROM alpine:latest
WORKDIR /pb

# Download PocketBase (Change version if needed)
ARG PB_VERSION=0.22.21
RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/
RUN rm /tmp/pb.zip

# Copy the built React app from Stage 1 into PocketBase's public serving folder
COPY --from=build /app/dist /pb/pb_public

EXPOSE 8090

# Start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]

