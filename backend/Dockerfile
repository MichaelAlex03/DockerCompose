FROM node:24.12.0-alpine

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci 


COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]