INSERT INTO tb_user (avatar, background_img_url, bio, email, name, password, profile_name) VALUES ('uploads/avatars/77d24b20-1f55-476b-8d64-36d8a07dc064_teste2.jpg', NULL, NULL, 'gustavo.gmartx@gmail.com', 'Gustavo Martins', '$2a$10$LfpaOMt7Q5vRKeklhcN30ePcCL0vMwvgtrqFh4h7gr720S37IjoNS', '@gumartx');
INSERT INTO tb_user (avatar, background_img_url, bio, email, name, password, profile_name) VALUES ('uploads/avatars/21f1031f-36d6-4754-ad7c-da23514ccc20_fofo.png', NULL, NULL, 'gustavo@gmail.com', 'Gustavo Martins', '$2a$10$ZtlbC/Degad/bJRvptaGE.poezutFWvoR1MYJHXBg42atp.EuvrGe', '@ane');
INSERT INTO tb_user (avatar, background_img_url, bio, email, name, password, profile_name) VALUES (NULL, NULL, NULL, 'bru@gmail.com', 'bruna', '$2a$10$8d9a/Trpz/HT0MxRA/1qr.YtHKXEVx7r1yu9BB53lp9uk5MKHeYh2', '@garotagelida');

INSERT INTO tb_movie (id, poster_path, title) VALUES (83533, '/9k2zKeUfcKkAz1dGt5MP6dZMm4G.jpg', 'Avatar: Fogo e Cinzas');
INSERT INTO tb_movie (id, poster_path, title) VALUES (1523145, '/hXNn25hE2SH2kHMPVOLjqDISSxf.jpg', 'Um Amor de Mentiras');

INSERT INTO tb_list (created_at, user_id, description, name, is_public) VALUES ('2026-04-08', 1, NULL, 'teste2', false);
INSERT INTO tb_list (created_at, user_id, description, name, is_public) VALUES ('2026-04-08', 1, NULL, 'teste1', false);
INSERT INTO tb_list (created_at, user_id, description, name, is_public) VALUES ('2026-04-08', 1, NULL, 'publica1', true);
INSERT INTO tb_list (created_at, user_id, description, name, is_public) VALUES ('2026-04-08', 1, NULL, 'publica2', true);

INSERT INTO tb_rating (created_at, score, movie_id, user_id, platform) VALUES ('2026-04-08', 4.0, 1523145, 1, 'GLOBOPLAY');
INSERT INTO tb_rating (created_at, score, movie_id, user_id, platform) VALUES ('2026-04-08', 4.0, 83533, 1, NULL);
INSERT INTO tb_rating (created_at, score, movie_id, user_id, platform) VALUES ('2026-04-08', 1.0, 1523145, 2, 'CINEMA');
INSERT INTO tb_rating (created_at, score, movie_id, user_id, platform) VALUES ('2026-04-08', 5.0, 83533, 2, NULL);
INSERT INTO tb_rating (created_at, score, movie_id, user_id, platform) VALUES ('2026-04-08', 2.0, 1523145, 3, 'CINEMA');
INSERT INTO tb_rating (created_at, score, movie_id, user_id, platform) VALUES ('2026-04-08', 4.0, 83533, 3, NULL);

INSERT INTO tb_list_movie (list_id, movie_id) VALUES (1, 83533);
INSERT INTO tb_list_movie (list_id, movie_id) VALUES (1, 1523145);
INSERT INTO tb_list_movie (list_id, movie_id) VALUES (2, 83533);
INSERT INTO tb_list_movie (list_id, movie_id) VALUES (2, 1523145);

INSERT INTO tb_follow (follower_id, following_id) VALUES (1, 2);
INSERT INTO tb_follow (follower_id, following_id) VALUES (1, 3);
INSERT INTO tb_follow (follower_id, following_id) VALUES (2, 1);
INSERT INTO tb_follow (follower_id, following_id) VALUES (3, 1);
INSERT INTO tb_follow (follower_id, following_id) VALUES (3, 2);

INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-15T20:43:49.52651', 83533, NULL, 1, 'novo');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-12T20:43:49.52651', 83533, NULL, 1, 'novo2');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-13T20:43:49.52651', 83533, NULL, 1, '1');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-10T20:43:51.895916', 83533, NULL, 1, '2');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-09T20:43:54.032064', 83533, NULL, 1, '3');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-08T20:43:49.52651', 83533, NULL, 1, '4');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-14T20:43:49.52651', 83533, NULL, 1, '5');;
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-14T20:43:49.52651', 83533, NULL, 1, '57');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-01T20:43:49.52651', 83533, NULL, 1, '6');
INSERT INTO tb_comment (created_at, movie_id, parent_id, user_id, message) VALUES ('2026-04-13T23:43:49.52651', 83533, NULL, 1, 'mais velho');
