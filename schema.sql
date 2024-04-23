create table api_keys
(
    id         bigint unsigned auto_increment primary key,
    name       varchar(100)                        null,
    code       varchar(1024)                       not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null
);