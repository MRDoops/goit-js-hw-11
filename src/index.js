import NewsApiService from './js/api-service';
import { lightbox } from './js/lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const options = {
  rootMargin: '50px',
  threshold: 0.3,
};
const observer = new IntersectionObserver(onLoadMore, options);

async function onSearch(e) {
  e.preventDefault();

  refs.galleryContainer.innerHTML = '';
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();
  newsApiService.totalHits = 0;

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');
    return;
  }

  await fetchGallery();
  const { totalHits, hits } = newsApiService;
  Notify.success(`Hooray! We found ${totalHits} images !!!`);
  console.log(newsApiService);
  onRenderGallery(hits);
}

async function onLoadMore() {
  newsApiService.page += 1;
  await fetchGallery();
}

async function fetchGallery() {
  refs.loadMoreBtn.classList.add('is-hidden');

  try {
    const response = await newsApiService.fetchGallery();

    if (!response || response.hits.length === 0) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      newsApiService.totalHits = 0;
      return;
    }

    const { hits, totalHits } = response;

    onRenderGallery(hits);
    const shownCount = hits.length;

    if (shownCount < totalHits) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    } else {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    newsApiService.totalHits = shownCount;
  } catch (error) {
    console.error(error);
    Notify.failure('Oops! Something went wrong. Please try again later.');
  }
}

function onRenderGallery(elements = []) {
  if (elements.length === 0) {
    return;
  }

  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
					<a href="${largeImageURL}">
						<img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
					</a>
					<div class="info">
						<p class="info-item">
							<b>Likes</b>
							${likes}
						</p>
						<p class="info-item">
							<b>Views</b>
							${views}
						</p>
						<p class="info-item">
							<b>Comments</b>
							${comments}
						</p>
						<p class="info-item">
							<b>Downloads</b>
							${downloads}
						</p>
					</div>
				</div>`;
      }
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
