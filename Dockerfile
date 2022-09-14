FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy pnpm-lock.yaml
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Remove .env file if it exists
RUN rm -f .env

# Replace .env with .env.production
RUN cp .env.production .env

# Expose the port on which the server will run
EXPOSE 3000

# Start the backend server
CMD ["pnpm", "start"]