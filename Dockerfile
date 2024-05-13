FROM node:20

# Set working directory
WORKDIR /app

# Copy project
COPY . .

COPY .env.development .env

# Install app dependencies
RUN npm ci

# Expose the port the app runs on
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]