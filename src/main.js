import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    hideLoadMoreButton,
    showLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query;
let page = 1;
const perPage = 15;
let prevQuery = '';

form.addEventListener('submit', async e => {
    e.preventDefault();

    hideLoadMoreButton();
    clearGallery();

    query = e.target.elements['search-text'].value.trim();
    if (!query) return;

    await showImages(query); // Дочекайся завершення завантаження
});

loadMoreBtn.addEventListener('click', async () => {
    hideLoadMoreButton();

    await showImages(query); // Дочекайся завантаження
    scrollView(); // Прокрутка тільки при натисканні кнопки
});

async function showImages(query) {
    if (!query) return;

    showLoader();

    if (prevQuery !== query) {
        page = 1;
        prevQuery = query;
    }

    try {
        const data = await getImagesByQuery(query, page, perPage);
        const images = data.hits;

        if (images && images.length > 0) {
            createGallery(images);

            if (page >= Math.ceil(data.totalHits / perPage)) {
                iziToast.show({
                    title: 'ℹ️',
                    message: "We're sorry, but you've reached the end of search results.",
                    messageColor: 'white',
                    titleColor: 'white',
                    backgroundColor: '#4CAF50',
                    position: 'topRight',
                });
            } else {
                showLoadMoreButton();
            }
        } else {
            iziToast.show({
                title: '❌',
                message: `Sorry, there are no images matching your search query. Please try again!`,
                messageColor: 'white',
                titleColor: 'white',
                backgroundColor: '#ef4040',
                position: 'topRight',
            });
        }

        page++;
    } catch (err) {
        console.error(err);
    } finally {
        hideLoader();
    }
}

function scrollView() {
    const galleryItem = document.querySelector('.gallery-item');
    if (!galleryItem) return;
    setTimeout(() => {
        scrollBy({
            top: galleryItem.getBoundingClientRect().height * 2,
            left: 0,
            behavior: 'smooth',
        });
    }, 200);
}
