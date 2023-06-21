
window.onload = () => {


  const gallery = document.querySelector('.gallery');
  const masonry = new Masonry(gallery, {
    itemSelector: '.gallery_col',
    gutter: 10,
  });
};
