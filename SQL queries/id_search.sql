USE test;

WITH movie_info AS
(SELECT A.*, B.links AS poster_link
FROM
(SELECT id AS movie_id, title, release_date, vote_average, imdb_id, overview, runtime,
       status
FROM meta
WHERE id = 96451) A
LEFT JOIN imageLink B
ON A.imdb_id = B.IMDBid)
SELECT D.*, movie_info.*
FROM
(SELECT movie_id, GROUP_CONCAT(production_companies_name) AS production_companies_name
FROM
(SELECT A.movie_id, B.production_companies_name FROM
(SELECT movie_id, production_companies_id
FROM movieProductionCompanies
WHERE movie_id = 96451) A
LEFT JOIN productionCompanies B
ON A.production_companies_id = B.production_companies_id) C) D, movie_info;


