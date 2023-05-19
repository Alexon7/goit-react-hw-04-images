import { useEffect, useState } from 'react';
import { getImages } from '../services/pixabayAppi';

import css from './App.module.css';

import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [largeImgUrl, setLargeImgUrl] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [showBtn, setShowBtn] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const per_page = 12;
  const [prevQuery, setPrevQuery] = useState('');
  const [prevPage, setPrevPage] = useState(1);

  // state = {
  //   query: '',
  //   images: [],
  //   largeImgUrl: '',
  //   page: 1,
  //   per_page: 12,
  //   error: '',
  //   showBtn: false,
  //   isEmpty: false,
  //   isLoading: false,
  // };

  useEffect(() => {
    if (!query) {
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { hits, totalHits } = await getImages(query, page);

        if (hits.length === 0) {
          setIsEmpty(true);
        } else {
          setImages(prevImages => [...prevImages, ...hits]);
          setShowBtn(page < Math.ceil(totalHits / per_page));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (query !== '' && (query !== prevQuery || page !== prevPage)) {
      fetchData();
    }

    setPrevQuery(query);
    setPrevPage(page);
  }, [query, page, prevPage, prevQuery]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onFormSubmit = query => {
    setQuery(query);
    setImages([]);
    setLargeImgUrl('');
    setPage(1);
    setError('');
    setShowBtn(false);
    setIsEmpty(false);
    setIsLoading(false);
  };

  const onImageClick = largeImgUrl => {
    setLargeImgUrl(largeImgUrl);
  };

  const hasError = error.length > 0;
  return (
    <div className={css.App}>
      <SearchBar onSubmit={onFormSubmit} />
      {hasError && (
        <p>
          Oh, something went wrong <b>{error}</b>! Please, try again!
        </p>
      )}
      {isEmpty && (
        <p>
          Oh, there is no such a query as <b>{query}</b>! Please, try again!
        </p>
      )}
      {isLoading && <Loader />}
      {Array.isArray(images) && (
        <ImageGallery list={images} onImageClick={onImageClick} />
      )}
      {showBtn && <Button onClick={loadMore} />}
      {largeImgUrl && (
        <Modal largeImgUrl={largeImgUrl} onImageClick={onImageClick} />
      )}
    </div>
  );
};
