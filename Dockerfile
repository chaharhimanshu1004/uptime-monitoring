# Use the official Node.js image with version 22
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


# Expose the port your Next.js app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
