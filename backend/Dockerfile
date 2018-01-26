FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
RUN mkdir /code/bidsoup
COPY bidsoup/ /code/bidsoup/
COPY bidsoup_uwsgi.ini /code/
COPY scripts/ /code/
CMD uwsgi /code/bidsoup_uwsgi.ini
EXPOSE 8000
