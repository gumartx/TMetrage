INSERT INTO tb_user (id, name, profile_name, email, password) VALUES (1, 'Gustavo Gomes', '@gusmarg', 'gustavo.gmartx@gmail.com', '$2a$10$2VMhL3YLGCthZkX6kkDfoO6XdTd8zr7QXPm6ELnXhXeB.oo6VphVW');
INSERT INTO tb_user (id, name, profile_name, email, password) VALUES (2, 'Bruna Barbosa', '@gelidagarota', 'bruna.gelida@gmail.com', '$2a$10$2VMhL3YLGCthZkX6kkDfoO6XdTd8zr7QXPm6ELnXhXeB.oo6VphVW');

INSERT INTO tb_follow (follower_id, following_id) VALUES (1, 2);
INSERT INTO tb_follow (follower_id, following_id) VALUES (2, 1);