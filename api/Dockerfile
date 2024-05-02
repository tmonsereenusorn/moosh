# Set base image (host OS)
FROM --platform=linux/amd64 python:3.12-alpine as build

# By default, listen on port 5000
EXPOSE 8080/tcp

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install system dependencies required for building certain Python packages
# including scipy and numpy
RUN apk update && \
    apk add --virtual build-deps \
    build-base \
    gcc \
    gfortran \
    clang \
    wget \
    git \
    openblas-dev \
    cmake \
    python3-dev \
    cython \
    py3-pip \
    linux-headers

# Install any Python dependencies
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY server.py .
COPY model.py .
COPY decorators.py .
COPY helpers.py .
COPY spotify_api.py .

COPY gunicorn_config.py .

# Specify the command to run on container start
CMD ["gunicorn", "--config", "gunicorn_config.py", "server:app"]