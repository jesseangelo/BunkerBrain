Just the API (since Nx is overkill)

When a change is made to the DOCKERFILE

docker build -t brain-app .

Then...

docker run -p 3000:3000 brain-app