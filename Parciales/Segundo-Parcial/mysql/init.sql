CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS notificaciones_db;

CREATE USER IF NOT EXISTS 'auth_user'@'%' IDENTIFIED BY 'auth_pass';
CREATE USER IF NOT EXISTS 'notif_user'@'%' IDENTIFIED BY 'notif_pass';

GRANT ALL PRIVILEGES ON auth_db.* TO 'auth_user'@'%';
GRANT ALL PRIVILEGES ON notificaciones_db.* TO 'notif_user'@'%';
FLUSH PRIVILEGES;
