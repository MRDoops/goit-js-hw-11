import axios from 'axios';

export default class NewsApiService {

  constructor() {
    this.API_KEY = '34747120-e4fca1e88a6c5e357c0eab0b1';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.query = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = 0;
    this.imageType = 'photo';
    this.orientation = 'horizontal';
    this.safeSearch = true;
  }


  async fetchGallery() {
    const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${this.query}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safeSearch}&page=${this.page}&per_page=${this.perPage}`;

    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch data');
    }
  }

  async fetchTotalHits() {
    const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${this.query}&per_page=1`;

    try {
      const { data } = await axios.get(url);
      return data.results;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch data');
    }
  }

  resetPage() {
    this.page = 1;
  }
}
