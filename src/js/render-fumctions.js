import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

export function createGallery(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags }) => `
    <li class="gallery-item">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
    </li>`).join('');

    galleryContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
}

export function clearGallery() {
    galleryContainer.innerHTML = '';
}

export function showLoader() {
    loader.classList.add('visible');
}

export function hideLoader() {
    loader.classList.remove('visible');
}

export function showLoadMoreButton() {
    loadMoreBtn.classList.add('visible');
}

export function hideLoadMoreButton() {
    loadMoreBtn.classList.remove('visible');
}