USE test;

WITH movie_info AS (SELECT A.movie_id, B.title, B.release_date, B.vote_average, B.imdb_id
FROM
(SELECT DISTINCT movie_id
FROM movieKeywords
WHERE movie_id IN (SELECT DISTINCT movie_id
                    FROM
                    movieGenresRelation
                    WHERE genres_id IN (SELECT DISTINCT genres_id
                                        FROM genres
                                       WHERE genres_name = 'Adventure')) LIMIT 50) A LEFT JOIN meta B
ON A.movie_id = B.id)
SELECT E.*, F.links AS poster_link
FROM
(SELECT movie_info.*, score AS rating
FROM movie_info
         LEFT JOIN(SELECT movieId, (mean - 1.96 * std) AS score
                   FROM (SELECT movieId, AVG(rating) AS mean, STD(rating) AS std
                         FROM ratings
                         WHERE movieId IN (SELECT movie_id AS movidId FROM movie_info)
                         GROUP BY movieId) C) D
                  ON movie_info.movie_id = D.movieId) E LEFT JOIN imageLink F
ON E.imdb_id = F.IMDBid
ORDER BY rating DESC, vote_average DESC;