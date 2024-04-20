# Find relevant info in our [Wiki](https://github.com/StanfordCS194/Win24-Team2/wiki).

# Frontend

To run the frontend, run the following in your command line:

```
cd frontend
npm install (if you haven't installed dependencies)
npm start
```

Also make sure you have the `.env` file with the correct environment variables in the `frontend` directory.

The frontend will be running on `http://localhost:3000`.

# API

To run the API, run the following in your command line:

```
cd api
source env/bin/activate
pip install -r requirements.txt (if you haven't installed dependencies)
python server.py
```

Ensure that you have a virtual environment (i.e. `python3 -m venv env`).

The backend will be running on `http://127.0.0.1:5000`.

## Deployment

The API is hosted in production using `gunicorn`, Docker, and AWS Lightsail. Make sure that you have installed the AWS CLI and been added as an IAM User to the Moosh AWS organization. Follow these steps to deploy a new image:
1. `pip freeze > requirements.txt` (if any new packages have been added)
2. `docker build -t backend .` to build the docker image, named `backend`
3. `aws lightsail push-container-image --service-name moosh-api --label backend --image backend` to push the updated image to the remote `moosh-api` Lightsail container
4. `aws lightsail create-container-service-deployment --service-name moosh-api --containers file://containers.json --public-endpoint file://public-endpoint.json` to deploy the latest image in the `moosh-api` container to production.
