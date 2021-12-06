
USE test;

SELECT distinct u.movie_id,
       m.title,
       m.release_date,
       m.vote_average,
       m.imdb_id,
       m.overview,
       m.runtime,
       m.status,
       il.links as poster_link,
       pc.production_companies_name as production_companies
from (select * from userFav where user_id=1) u left join (select * from meta order by vote_average desc) m
                                                                  on m.id=u.movie_id
                                                       left join movieInfo mi
                                                                  on u.user_id=mi.movie_id
                                                       left join imageLink il
                                                                  on m.imdb_id=il.IMDBid
                                                       left join productionCompanies pc
                                                                  on mi.production_companies_id=pc.production_companies_id
limit 10;