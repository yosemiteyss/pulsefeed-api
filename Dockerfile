FROM node:20

# Set working directory
WORKDIR /app

# Copy packge.json
COPY package*.json ./

# Copy project
COPY . .

# Install app dependencies
RUN npm ci

# Run build
RUN npm run build

# Expose port
EXPOSE 3000

# Start prod build
ENTRYPOINT ["npm", "run", "start:prod"]