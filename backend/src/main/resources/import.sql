INSERT INTO tb_user (name, profile_name, email, password) VALUES ('Gustavo Gomes', 'gumartx', 'gustavo@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
INSERT INTO tb_user (name, profile_name, email, password) VALUES ('João Pedro', 'moorgsz', 'moorgado@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');

INSERT INTO tb_follow (follower_id, following_id) VALUES (1, 2);
INSERT INTO tb_follow (follower_id, following_id) VALUES (2, 1);

INSERT INTO tb_movie (id) VALUES (1);
INSERT INTO tb_movie (id) VALUES (2);
INSERT INTO tb_movie (id) VALUES (3);
INSERT INTO tb_movie (id) VALUES (4);

INSERT INTO tb_rating (user_id, movie_id, score, platform, created_at) VALUES (1, 1, 2.0, 'NETFLIX', '2026-02-01');
INSERT INTO tb_rating (user_id, movie_id, score, platform, created_at) VALUES (1, 2, 1.0, 'NETFLIX', '2026-03-30');
INSERT INTO tb_rating (user_id, movie_id, score, platform, created_at) VALUES (1, 3, 1.0, 'DISNEY_PLUS', '2026-03-01');
INSERT INTO tb_rating (user_id, movie_id, score, platform, created_at) VALUES (1, 4, 5.0, 'OUTRO', '2025-02-01');

