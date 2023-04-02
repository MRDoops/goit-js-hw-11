import { refs } from './refs';

export function createGalleryMarkup(images) {
  return images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a href="${largeImageURL}">
              <img
              class="photo-img"
              src="${webformatURL}"
              alt="${tags}"
              loading="lazy"
            />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');
}

export function renderGalleryMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(images));
}
