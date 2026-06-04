CREATE TABLE IF NOT EXISTS tanks (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    latitude         FLOAT NOT NULL,
    longitude        FLOAT NOT NULL,
    ph               FLOAT NOT NULL,
    hardness         FLOAT NOT NULL,
    solids           FLOAT NOT NULL,
    chloramines      FLOAT NOT NULL,
    sulfate          FLOAT NOT NULL,
    conductivity     FLOAT NOT NULL,
    organic_carbon   FLOAT NOT NULL,
    trihalomethanes  FLOAT NOT NULL,
    turbidity        FLOAT NOT NULL,
    cleanliness_rating FLOAT DEFAULT 0,
    status           VARCHAR(30) DEFAULT 'Unknown',
    user_count       INTEGER DEFAULT 0
);

INSERT INTO tanks (name, latitude, longitude, ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon, trihalomethanes, turbidity, user_count) VALUES
('Tank A - Gulberg',     31.5204, 74.3587, 7.2, 190.0, 18000.0, 7.5, 350.0, 420.0, 14.0, 70.0,  3.5, 12000),
('Tank B - DHA',         31.4804, 74.4033, 6.8, 210.0, 21000.0, 8.1, 410.0, 480.0, 16.5, 85.0,  4.1,  9500),
('Tank C - Johar Town',  31.4690, 74.2809, 7.8, 175.0, 16500.0, 6.9, 320.0, 390.0, 12.8, 62.0,  3.1, 15000),
('Tank D - Model Town',  31.4934, 74.3363, 6.2, 230.0, 24000.0, 9.3, 470.0, 520.0, 18.2, 98.0,  4.8,  8000),
('Tank E - Cantt',       31.5497, 74.3436, 7.5, 195.0, 19500.0, 7.8, 370.0, 440.0, 15.1, 74.0,  3.7, 11000),
('Tank F - Bahria Town', 31.3656, 74.1734, 7.1, 185.0, 17200.0, 7.2, 340.0, 410.0, 13.5, 68.0,  3.3, 20000);
