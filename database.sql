-- Database Name: solo_project

-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(80) UNIQUE NOT NULL,
    "password" VARCHAR(1000) NOT NULL,
    "email" VARCHAR(1000) NOT NULL
);

CREATE TABLE "class" (
	"id" SERIAL PRIMARY KEY,
	"class_name" VARCHAR(100) NOT NULL
);

CREATE TABLE "build_type" (
	"id" SERIAL PRIMARY KEY,
	"build_type" VARCHAR(100)
);

CREATE TABLE "characters" (
	"id" SERIAL PRIMARY KEY,
	"character_name" VARCHAR(100) NOT NULL,
    "user_id" INT REFERENCES "user",
	"class_id" INT REFERENCES "class",
	"build_type_id" INT REFERENCES "build_type"
);

CREATE TABLE "party" (
	"id" SERIAL PRIMARY KEY,
	"party_name" VARCHAR(50),
    "user_id" INT REFERENCES "user"
);

CREATE TABLE "party_character_join" (
	"id" SERIAL PRIMARY KEY,
	"party_id" INT REFERENCES "party",
	"character_id" INT REFERENCES "characters"
);

CREATE TABLE "worlds" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT REFERENCES "user",
    "world_name" VARCHAR(100) NOT NULL,
    "progress_state" INT,
    "party_id" INT REFERENCES "party"
);

INSERT INTO "class"
("name")
VALUES
('Warrior'),
('Rogue'),
('Ranger'),
('Paladin'),
('Sorcerer'),
('Wizard'),
('Artificer');

INSERT INTO "build_type"
("type")
VALUES
('male'),
('female'),
('androgynous');

CREATE TABLE "item" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(300)
);

CREATE TABLE "party_inventory_join" (
	"id" SERIAL PRIMARY KEY,
	"quantity" INTEGER,
	"party_id" INT REFERENCES "party",
	"item_id" INT REFERENCES "item"
);

CREATE TABLE "properties" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100)
);

CREATE TABLE "isStaff" (
	"id" SERIAL PRIMARY KEY,
	"item_id" INT REFERENCES "item"
);

CREATE TABLE "spells" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100),
	"damage_val" INTEGER,
	"type" VARCHAR(100)
);

CREATE TABLE "staff_properties_join" (
	"id" SERIAL PRIMARY KEY,
	"property_id" INT REFERENCES "properties",
	"isStaff_id" INT REFERENCES "isStaff"
);

CREATE TABLE "staff_spells_join" (
	"id" SERIAL PRIMARY KEY,
	"isStaff_id" INT REFERENCES "isStaff",
	"spells_id" INT REFERENCES "spells"
);

CREATE TABLE "weapons" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100),
	"base_val" INTEGER
);

CREATE TABLE "isWeapon" (
	"id" SERIAL PRIMARY KEY,
	"item_id" INT REFERENCES "item",
	"weapon_id" INT REFERENCES "weapons"
);

CREATE TABLE "weapon_property_join" (
	"id" SERIAL PRIMARY KEY,
	"property_id" INT REFERENCES "properties",
	"isWeapon_id" INT REFERENCES "isWeapon"
);

CREATE TABLE "enemies" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(1000),
	"damage_val" INTEGER,
	"health" INTEGER,
	"intellect" VARCHAR(2)
);

--equipped {
--	id integer pk increments
--	char_id integer *> characters.id
--	item_id integer > item.id
--}
--
--environment {
--	id integer pk increments
--	name text
--	environment_scaling varchar(3)
--}
--
--location {
--	id integer pk increments
--	name text
--	environment_id integer *> environment.id
--}
--
--services {
--	id integer pk increments
--	name text
--}
--
--location-services-join {
--	id integer pk increments
--	location_id integer *> location.id
--	services_id integer *> services.id
--}
--
--enemies {
--	id integer pk increments
--	name text
--	damage_val integer
--	health integer
--	intellect varchar(1)
--}
--
--environment-enemy-join {
--	id integer pk increments
--	enemy_id integer *> enemies.id
--	environment_id integer *> environment.id
--}
--
--quests {
--	id integer pk increments
--	name text
--	is_main_quest boolean
--}
--
--party-quests-join {
--	id integer pk increments
--	party_id integer >* party.id
--	quest_id integer >* quests.id
--	is_completed boolean
--}