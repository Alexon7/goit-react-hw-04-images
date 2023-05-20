import { useEffect } from 'react';
import css from './Modal.module.css';

export const Modal = ({ largeImgUrl, onImageClick }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onImageClick('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onImageClick]);

  const handleBackdrop = e => {
    if (e.target === e.currentTarget) {
      onImageClick('');
    }
  };

  return (
    <div className={css.Overlay} onClick={handleBackdrop}>
      <div className={css.Modal}>
        <img src={largeImgUrl} alt="Large" />
      </div>
    </div>
  );
};
