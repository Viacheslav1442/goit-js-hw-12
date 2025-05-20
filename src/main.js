import { getImagesByQuery } from './pixabay-api';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton
} from './render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    query = e.target.elements.searchQuery.value.trim();
    if (!query) return;

    page = 1;
    clearGallery();
    hideLoadMoreButton();
    showLoader();

    try {
        const data = await getImagesByQuery(query, page);
        totalHits = data.totalHits;

        if (data.hits.length === 0) {
            iziToast.warning({ message: 'No images found', position: 'topRight' });
            return;
        }

        createGallery(data.hits);
        if (data.totalHits > 15) showLoadMoreButton();
    } catch (err) {
        iziToast.error({ message: 'Fetch failed', position: 'topRight' });
    } finally {
        hideLoader();
    }
});

loadMoreBtn.addEventListener('click', async () => {
    page += 1;
    showLoader();
    hideLoadMoreButton();

    try {
        const data = await getImagesByQuery(query, page);
        createGallery(data.hits);

        const totalLoaded = (page - 1) * 15 + data.hits.length;
        if (totalLoaded >= totalHits) {
            iziToast.info({ message: `We're sorry, but you've reached the end of search results.`, position: 'topRight' });
        } else {
            showLoadMoreButton();
        }

        scrollPage();
    } catch (err) {
        iziToast.error({ message: 'Error loading more images', position: 'topRight' });
    } finally {
        hideLoader();
    }
});

function scrollPage() {
    const { height: cardHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}