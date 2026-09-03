# Node 20 for the Next.js frontend. Single-stage build for simplicity in
# a dev/eval docker-compose setup - for a real production image, split
# this into build + runtime stages to keep the final image smaller.
FROM node:20-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
