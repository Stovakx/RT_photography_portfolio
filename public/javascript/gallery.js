window.onload = () => {
  const galleryCols = document.querySelectorAll('.gallery_col');
  const marginSize = 10;

  galleryCols.forEach((col) => {
    const img = col.querySelector('.gallery_item img');
    const colWidth = col.offsetWidth;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const colHeight = colWidth / imgAspectRatio;
    col.style.height = colHeight + 'px';
  });

  const gallery = document.querySelector('.gallery');
  const masonry = new Masonry(gallery, {
    itemSelector: '.gallery_col',
    gutter: marginSize,
  });
};
