CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS security;

CREATE TABLE IF NOT EXISTS core.ip2location_db3 (
  ip_from      bigint                 NOT NULL,
  ip_to        bigint                 NOT NULL,
  country_code character(2)           NOT NULL,
  country_name character varying(64)  NOT NULL,
  region_name  character varying(128) NOT NULL,
  city_name    character varying(128) NOT NULL,
  CONSTRAINT ip2location_db3_pkey PRIMARY KEY (ip_from, ip_to)
);

--COPY core.ip2location_db3 FROM '/Users/ivan/IdeaProjects/tst/pushapp/src/main/resources/IP2LOCATION-LITE-DB3.CSV' WITH CSV QUOTE AS '"';

-- ALTER TABLE core.ip2location_db3
--   ADD COLUMN IF NOT EXISTS id SERIAL;
--
-- update core.ip2location_db3
-- set city_name = 'St Petersburg'
-- where city_name = 'Saint Petersburg';


CREATE TABLE IF NOT EXISTS core.subscription (
  id                serial primary key,
  endpoint          text                   not null,
  expiration_time   timestamp,
  p256dh            text,
  auth              text,
  source_url        text,
  ip                character varying(128),
  country_code      character(2),
  country_name      character varying(64),
  city_name         character varying(128),
  region_name       character varying(128),
  ip2location_id    bigint,
  brw_name          character varying(128),
  brw_major_version character varying(64),
  brw_full_version  character varying(64),
  brw_language      character varying(128),
  landing_language  character varying(64),
  os_name           character varying(64),
  os_version        character varying(64),
  referrer          text,
  traff_type        character varying(128) not null,
  is_active         boolean   default true,
  device_name       character varying(64),
  api_key           text,
  created_ts        timestamp default now()
);

-- ALTER TABLE core.subscription
--   ADD COLUMN IF NOT EXISTS os_name character varying(64);
-- ALTER TABLE core.subscription
--   ADD COLUMN IF NOT EXISTS os_version character varying(64);
-- ALTER TABLE core.subscription
--   ADD COLUMN IF NOT EXISTS referrer text;

CREATE TABLE IF NOT EXISTS core.payload (
  id                  serial primary key,
  title               text,
  body                text,
  icon                text,
  image               text,
  badge               text,
  vibrate             text,
  sound               text,
  dir                 character varying(8),
  tag                 character varying(64),
  data                text,
  require_interaction boolean,
  renotify            boolean,
  silent              boolean,
  actions             text,
  timestamp           timestamp,
  offer_url           text,
  offer_id            text,
  account_name        text,
  sub_total           bigint,
  hash                bigint,
  views_total         bigint    default 0,
  clicks_total        bigint    default 0,
  pushed_total        bigint    default 1,
  category            character varying(128),
  api_key             text,
  created_by          character varying(128),
  created_ts          timestamp default now()
);


CREATE TABLE IF NOT EXISTS security.users (
  login    character varying(128),
  enabled  boolean default true,
  password text,
  api_key  text, -- as 'login + ':' + secret' encoded by BCryptPasswordEncoder
  constraint pk_users primary key (login)
);

CREATE TABLE IF NOT EXISTS security.roles (
  id   serial primary key,
  name character varying(128)
);

CREATE TABLE IF NOT EXISTS security.authorities (
  login   character varying(128),
  role_id bigint
);

-- CREATE TABLE IF NOT EXISTS core.images (
--   id    serial primary key,
--   name  character varying(128),
--   image bytea
-- );

INSERT INTO security.roles
(name)
  SELECT 'ADMINISTRATOR'
  WHERE
    NOT EXISTS(SELECT id
               FROM security.roles
               WHERE name = 'ADMINISTRATOR');

INSERT INTO security.roles
(name)
  SELECT 'MANAGER'
  WHERE
    NOT EXISTS(SELECT id
               FROM security.roles
               WHERE name = 'MANAGER');




