document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery_item');

    for (let i = 0; i < images.length; i++) {
        var image = images[i];

        // Checking image width/height
        if (image.naturalHeight < image.naturalWidth) {
            image.classList.add('horizontalImg');
        } else {
            image.classList.add('verticalImg');
        }
    }

    const gallery = document.querySelector('.gallery');
    const masonry = new Masonry(gallery, {
        itemSelector: '.gallery_col',
        columnWidth: '.gallery_col',
        percentPosition: true,
        fitWidth: true,
    });
});
