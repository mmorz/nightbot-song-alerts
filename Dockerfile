FROM cypress/base:10

RUN apt-get update && apt-get install -y wait-for-it

ENV APP /app

COPY package.json package-lock.json $APP/

WORKDIR $APP

RUN npm ci

ENV SONG_ALERT_UAID empty
ENV SENTRY_DSN empty

COPY . $APP
RUN npm run build

CMD ["./script/travis.sh"]
