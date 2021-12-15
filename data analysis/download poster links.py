import imdb
import os
import numpy as np
import pandas as pd
import time
import click

link_data = pd.read_csv('links.csv')
imdbid = link_data['imdbId']
imdbid = imdbid.unique()


def url_clean(url):
    """
    clean the url for the poster
    Args:
        url: original url to the poster (which is small)
    Returns:
        url to the poster that is large enough
    """
    base, ext = os.path.splitext(url)
    i = url.count('@')
    s2 = url.split('@')[0]
    url = s2 + '@' * i + ext
    return url

@click.command()
@click.option('--output_path', required=True)
def main(output_path):
    access = imdb.IMDb()
    poster_links = []
    fail_counter = 0

    for i in range(len(imdbid)):
        Id = imdbid[i]
        movie = access.get_movie(Id)
        try:
            cover_url = url_clean(movie['cover url'])
        except:
            cover_url = np.nan
            fail_counter += 1
            print("fail : {}".format(fail_counter))
            access = imdb.IMDb()
        poster_links.append(cover_url)

    img_link = pd.DataFrame({'IMDBid' : imdbid, 'links' : poster_links})
    img_link = img_link.set_index('IMDBid')
    save_path = os.path.join('output_path', 'img_link.csv')
    img_link.to_csv(save_path)

if __name__ == '__main__':
    main()
