FROM python:3.12.13-alpine3.24
WORKDIR /server
COPY requirements.txt  requirements.txt
RUN pip install -r requirements.txt
COPY . .
CMD [ "python", "main.py" ]