FROM python:3.11.7-bookworm

WORKDIR /root

COPY ./requirements.txt /root

RUN apt-get update
RUN apt-get upgrade -y
RUN pip install --upgrade pip
RUN pip install -r requirements.txt



