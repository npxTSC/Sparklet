FROM node:19

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code to the container
COPY . .

# Build the app using TypeScript and Webpack
RUN npm run build

# Expose the port that the app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
