USE test;

WITH movie_info AS(
SELECT E.movie_id, E.title, E.release_date, E.vote_average, E.imdb_id,
       E.overview, E.runtime, E.status, F.links AS poster_link
FROM
((SELECT C.movie_id, D.title, D.release_date, D.vote_average, D.imdb_id,
                           D.overview, D.runtime, D.status
FROM
(SELECT movie_id
FROM (SELECT DISTINCT keyword_id
FROM keywords
WHERE UPPER(keyword_name) LIKE '%New York: A Documentary Film%') A JOIN movieKeywords B
ON A.keyword_id = B.keyword_id) C JOIN meta D
ON C.movie_id = D.id)
UNION
(SELECT id AS movie_id, title, release_date, vote_average, imdb_id,
        overview, runtime, status
FROM meta
WHERE UPPER(title) LIKE '%New York: A Documentary Film%')) E LEFT JOIN imageLink F ON E.imdb_id = F.IMDBid)
SELECT movie_info.movie_id, movie_info.title, movie_info.release_date, movie_info.vote_average,
       movie_info.runtime, movie_info.status, movie_info.poster_link, production_companies
FROM movie_info
LEFT JOIN
(SELECT J.movie_id, GROUP_CONCAT(J.company_name) AS production_companies
FROM
(SELECT G.movie_id, H.production_companies_id AS company_id, I.production_companies_name AS company_name
FROM movie_info G
LEFT JOIN
movieProductionCompanies H
ON G.movie_id = H.movie_id
LEFT JOIN productionCompanies I
ON H.production_companies_id = I.production_companies_id) J
GROUP BY J.movie_id) L
ON movie_info.movie_id = L.movie_id
ORDER BY movie_info.vote_average DESC;

describe meta;