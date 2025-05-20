import axios from 'axios';

const API_KEY = '50282426-bcbed3422443d463b1ec5299f';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
    const params = {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: PER_PAGE,
    };

    const response = await axios.get(BASE_URL, { params });
    return response.data;
}
