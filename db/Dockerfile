FROM postgres:9.4.1

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 4200:4200

ENV POSTGRES_USER user
ENV POSTGRES_PASSWORD supersecret
ENV POSTGRES_DB dbname