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

# Copy full nginx.conf and default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the React build files to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html


# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx with explicit config path
CMD ["nginx", "-g", "daemon off;"]
