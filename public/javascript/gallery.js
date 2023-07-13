
window.onload = () => {
  const galleries = document.querySelectorAll('.gallery');
  
  galleries.forEach((gallery) => {
    const masonry = new Masonry(gallery, {
      itemSelector: '.gallery_col',
      columnWidth: '.gallery_col',
      gutter: 10,
      transitionDuration: '0.8s',
    });
  });
};
