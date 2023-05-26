//image preview when clicked on reset button, img preview doesn't clear src
/* const uploadInput = document.getElementById('image-input');
const previewImage = document.getElementById('preview-image');
const cancelButton = document.getElementById('cancelButton');

uploadInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
//delete preview image to empty src doesn't work atm
cancelButton.addEventListener('click', function() {
  uploadInput.value = null;
  previewImage.src = '';
});
 */
//uploading photos
const uploadForm = document.getElementById('uploadForm');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append('image', document.getElementById('image-input').files[0]);
    formData.append('photoName', document.getElementById('name-input').value);
    // Add other form fields if needed

    const response = await fetch('/admin/dashboard/upload', {
      method: 'POST',
      body: formData,
    });
  
    if (response.ok) {
      // Success: Do something here, like displaying a success message or redirecting
      window.location.reload()
      console.log('Photo uploaded successfully');
    } else {
      // Error: Do something here, like displaying an error message
      console.error('Failed to upload photo');
    }
  } catch (error) {
    console.error(error);
  }
  console.log(formData)
});

//logout form
const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () => {
  fetch('/logout', {
    method: 'GET'
  })
    .then(response => {
      if (response.ok) {        
        window.location.href = '/';
        console.log('Logout was succesfull')
      } else {
        console.error('Logout failed');
      }
    })
    .catch(error => {
      console.error(error);
    });
})

// delete photos from website folder and from db
const deleteForm = document.getElementById('deleteForm');
console.log('Event listener attached');

// Attach an event listener to the form submission
deleteForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the selected checkboxes
  const checkboxes = document.querySelectorAll('.checkboxDeleteForm:checked');
  const photoIds = Array.from(checkboxes).map(checkbox => checkbox.value);

  // Create an AJAX request
  const response = await fetch('/admin/dashboard/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoIds })
  });

  console.log(response);

  if (response.ok) {
    window.location.reload();
    console.log('Photos deleted successfully');
  } else {
    console.log('Something went wrong');
  }
});


//gallery delete form
const deleteFormGallery = () => {
  const availableImages = [];
  const galleryDivs = document.querySelectorAll('.galleryDeleteForm');
  galleryDivs.forEach((galleryDiv) => {
    const image = galleryDiv.querySelector('.imgDeleteForm');
    if (image) {
      const imageUrl = image.getAttribute('src');
      availableImages.push(imageUrl);
    }
  });
  const imgWidths = [];
  const numberOfImages = availableImages.length;
  const maxWidth = 180;
  const minWidth = 70;
  for (let i = 0; i < numberOfImages; i++) {
    const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    imgWidths.push(width);
  }
  const createGallery = () => {
    const galleryDivs = document.querySelectorAll('.galleryDiv');
    const Gallery = document.getElementById('gallery');
    let rowWidth = 0;
    let rowIndex = 0;
    for (let i = 0; i < imgWidths.length; i++) {
      const photo = new Image();
      photo.src = '../uploads/index';
      photo.width = imgWidths[i];
      photo.classList.add('formGalleryImg');
      Gallery.appendChild(photo);
      rowWidth += imgWidths[i];
      if (rowWidth >= galleryDivs[i].clientWidth) {
        rowWidth = 0;
        rowIndex++;
      }
    }
  };
  createGallery();
};
deleteFormGallery()

//gallery upload form
const uploadFormGallery = () => {
  const availableImages = [];
  const galleryDivs = document.querySelectorAll('.galleryDeleteForm');
  galleryDivs.forEach((galleryDiv) => {
    const image = galleryDiv.querySelector('.imgUpdateForm');
    if (image) {
      const imageUrl = image.getAttribute('src');
      availableImages.push(imageUrl);
    }
  });
  const imgWidths = [];
  const numberOfImages = availableImages.length;
  const maxWidth = 180;
  const minWidth = 70;
  for (let i = 0; i < numberOfImages; i++) {
    const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    imgWidths.push(width);
  }
  const createGallery = () => {
    const galleryDivs = document.querySelectorAll('.image-container');
    const Gallery = document.getElementById('image-gallery');
    let rowWidth = 0;
    let rowIndex = 0;
    for (let i = 0; i < imgWidths.length; i++) {
      const photo = new Image();
      photo.src = '../uploads/index';
      photo.width = imgWidths[i];
      photo.classList.add('formGalleryImg');
      Gallery.appendChild(photo);
      rowWidth += imgWidths[i];
      if (rowWidth >= galleryDivs[i].clientWidth) {
        rowWidth = 0;
        rowIndex++;
      }
    }
  };
  createGallery();
};
uploadFormGallery()

//sortable.js
const gallery = document.getElementById('image-gallery');
const sortable = sortable.create(gallery, {
  animation: 150, // Duration of the animation in milliseconds
  handle: '.image-container', // Restrict dragging to the image containers
  onEnd: function (event) {
    // Get the new order of the images
    const newOrder = Array.from(gallery.getElementsByClassName('image-container')).map(function (element, index) {
      element.setAttribute('data-order', index + 1);
      return {
        id: element.getAttribute('data-id'),
        order: index + 1
      };
    });

    // Perform an AJAX request to update the image order on the server
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/update', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('Image order updated successfully.');
      }
    };
    xhr.send(JSON.stringify(newOrder));
  }
});