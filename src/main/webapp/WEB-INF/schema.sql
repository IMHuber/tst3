CREATE TABLE IF NOT EXISTS category (
id serial primary key,
name character varying(128),
description text
);

ALTER TABLE only category DROP CONSTRAINT IF EXISTS unique_cat_name;
alter table only category add constraint unique_cat_name unique (name);

CREATE TABLE IF NOT EXISTS subscription (
id serial primary key,
endpoint text not null,
expiration_time timestamp,
p256dh text,
auth text,
source_url text
);

ALTER TABLE subscription ADD COLUMN IF NOT EXISTS language character varying(128);


CREATE TABLE IF NOT EXISTS subscription_category_ref (
subscription_id bigint not null,
category_id bigint not null
);



INSERT INTO category
(name, description)
  SELECT 'Sport', 'Everything that has connection to sport'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Sport' and description = 'Everything that has connection to sport');

INSERT INTO category
(name, description)
  SELECT 'Adult', 'Everything that has connection to adult'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Adult' and description = 'Everything that has connection to adult');

INSERT INTO category
(name, description)
  SELECT 'Business', 'Everything that has connection to business'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Business' and description = 'Everything that has connection to business');

INSERT INTO category
(name, description)
  SELECT 'Games', 'Everything that has connection to games'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Games' and description = 'Everything that has connection to games');

INSERT INTO category
(name, description)
  SELECT 'Health', 'Everything that has connection to health'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Health' and description = 'Everything that has connection to health');

INSERT INTO category
(name, description)
  SELECT 'Home', 'Everything that has connection to home'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Home' and description = 'Everything that has connection to home');

INSERT INTO category
(name, description)
  SELECT 'Kids', 'Everything that has connection to kids or children'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Kids' and description = 'Everything that has connection to kids or children');

INSERT INTO category
(name, description)
  SELECT 'News', 'Everything that has connection to news'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'News' and description = 'Everything that has connection to news');

INSERT INTO category
(name, description)
  SELECT 'Science', 'Everything that has connection to science'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Science' and description = 'Everything that has connection to science');

INSERT INTO category
(name, description)
  SELECT 'Shopping', 'Everything that has connection to shopping'
  WHERE
    NOT EXISTS (SELECT id FROM category WHERE name = 'Shopping' and description = 'Everything that has connection to shopping');

