# Step 1: Build the React app
FROM node:23-slim AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install && ls -la node_modules

# Copy all the React app files
COPY . ./

# Build the React app for production
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy the React build files to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
