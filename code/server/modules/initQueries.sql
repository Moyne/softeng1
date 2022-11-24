CREATE TABLE IF NOT EXISTS USERS(id INTEGER NOT NULL,name VARCHAR,surname VARCHAR,password VARCHAR,email VARCHAR,type VARCHAR NOT NULL, PRIMARY KEY(id,type));
INSERT INTO USERS(id,name,surname,email,password,type)
VALUES (1,'Jeff','Dean','manager1@ezwh.com','$argon2i$v=19$m=4096,t=3,p=1$p86sWMX24Rmw+7zQpMyd7w$9pUcSFfGMHdVl6Sc+c8tJTERfV050has15sahtqLvAs','manager'),
        (1,'Elon','Musk','user1@ezwh.com','$argon2i$v=19$m=4096,t=3,p=1$p86sWMX24Rmw+7zQpMyd7w$9pUcSFfGMHdVl6Sc+c8tJTERfV050has15sahtqLvAs','customer'),
        (1,'Raymond','Trust','qualityEmployee1@ezwh.com','$argon2i$v=19$m=4096,t=3,p=1$p86sWMX24Rmw+7zQpMyd7w$9pUcSFfGMHdVl6Sc+c8tJTERfV050has15sahtqLvAs','qualityEmployee'),
        (1,'Jeff','Bezos','supplier1@ezwh.com','$argon2i$v=19$m=4096,t=3,p=1$p86sWMX24Rmw+7zQpMyd7w$9pUcSFfGMHdVl6Sc+c8tJTERfV050has15sahtqLvAs','supplier'),
        (1,'Charles','Leclerc','clerk1@ezwh.com','$argon2i$v=19$m=4096,t=3,p=1$p86sWMX24Rmw+7zQpMyd7w$9pUcSFfGMHdVl6Sc+c8tJTERfV050has15sahtqLvAs','clerk'),
        (1,'Max','Verstappen','deliveryEmployee1@ezwh.com','$argon2i$v=19$m=4096,t=3,p=1$p86sWMX24Rmw+7zQpMyd7w$9pUcSFfGMHdVl6Sc+c8tJTERfV050has15sahtqLvAs','deliveryEmployee');