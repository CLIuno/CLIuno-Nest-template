INSERT INTO `Roles` (id, `name`, createdAt, updatedAt) VALUES
('63c01504-e21e-4a8f-8f5f-e49eb5231529', 'admin', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00'),
('586b4615-85c8-4714-bf5f-89eabbd9fe82', 'user', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00'),
('c71c1d0e-c903-48e2-9852-11b7ec2711df', 'write', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00');

INSERT INTO `Users` (id, first_name, last_name, date_of_birth, gender, nationality, phone, email, username, `password`,role_id, createdAt, updatedAt) VALUES
('edb44192-4183-4f3e-92f0-0b7da3dc4530', 'bebo', 'boba', '1099-08-01', 'male', 'Saudi', '+966575821931', 'user@gmail.com', 'bebo', '$2a$12$3gd0ES6FIsgOYvlYEo5QD.mtF71CVxDwOAasEPfI7VgidmVfpnYKu','63c01504-e21e-4a8f-8f5f-e49eb5231529', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00'),
('661f29bf-e0aa-427a-90f6-d3b653fb9b6c', 'goga', 'doka', '1099-08-02', 'male', 'Saudi', '+966575822922', 'user1@gmail.com', 'doka', '$2a$12$3gd0ES6FIsgOYvlYEo5QD.mtF71CVxDwOAasEPfI7VgidmVfpnYKu','586b4615-85c8-4714-bf5f-89eabbd9fe82', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00'),
('8825b8b7-51bb-45c3-b57e-92ab18a536f2', 'loka', 'boga', '1099-08-03', 'male', 'Saudi', '+966575823913', 'user2@gmail.com', 'loka', '$2a$12$3gd0ES6FIsgOYvlYEo5QD.mtF71CVxDwOAasEPfI7VgidmVfpnYKu','c71c1d0e-c903-48e2-9852-11b7ec2711df', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00');

INSERT INTO `User_Role` (id, user_id, role_id, createdAt, updatedAt) VALUES
('9f8c4190-2541-4daa-b6c6-e319e578e7c0', 'edb44192-4183-4f3e-92f0-0b7da3dc4530', '8d7762a2-9262-4baf-ab57-1dcb5f4bcd5e', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00'),
('a7fb299e-0b1c-4ef6-a116-5622b64965fe', '661f29bf-e0aa-427a-90f6-d3b653fb9b6c', '9bcad0ba-07b5-4257-bac9-f859f0b9d802', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00'),
('849cf834-f2b5-422a-8318-1505b99764ae', '8825b8b7-51bb-45c3-b57e-92ab18a536f2', '0e115575-fd43-490b-8c1d-b952ba6be89b', '2024-07-17 12:55:04.502 +00:00', '2024-07-17 12:55:04.502 +00:00');



