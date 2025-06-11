#!/bin/bash

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "Please edit .env.local with your configuration"
else
    echo ".env.local already exists, skipping creation"
fi

echo "Setup complete!"
