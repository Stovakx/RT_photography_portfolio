/* to do: loadItems function
const galleryObserver = new IntersectionObserver((entries)=>{
    if (entries[0].intersectionRatio <= 0) return;
    loadItems(10);
    console.log('Loaded new imgs')
}) 
galleryObserver.observe(document.querySelector('.gallery'))*/
// zjišťování šířky a výšky img a vytvoření classy k div
/* document.addEventListener('DOMContentLoaded', () => {
    const imgList = document.querySelectorAll('.gallery_item');
  
    imgList.forEach((img) => {
      const dynamicImg = new Image();
  
      dynamicImg.src = img.src;
  
      dynamicImg.onload = function() {
        const width = this.width;
        const height = this.height;
        const galleryCol = img.closest('.gallery_col');
  
        if (width < height) {
          galleryCol.classList.add('horizontalImg');
        } else if (width === height) {
          galleryCol.classList.add('squareImg');
        } else {
          galleryCol.classList.add('verticalImg');
        }
      };
    });
  }); */
  
  const gallery = document.querySelector('.gallery');
  const masonry = new Masonry(gallery, {
    itemSelector: '.gallery_col',
    gutter: 10,
    percentPosition: true
  });
  