
//image preview when clicked on reset button, img preview doesn't clear src
const uploadInput = document.getElementById('image-input');
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

cancelButton.addEventListener('click', function() {
  uploadInput.value = null; // Clear the file input by setting its value to null
  previewImage.src = ''; // Clear the preview image by setting its source to an empty string
});

//uploading photos
const uploadForm = document.getElementById('uploadForm');
console.log('Upload event listener attached')
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    const fileInput = document.getElementById('image-input');
    for (const file of fileInput.files) {
      formData.append('image', file);
    }
    
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
console.log('Delete Event listener attached');

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
  const galleryDivs = document.querySelectorAll('.galleryDiv');
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
    for (let i = 0; i < galleryDivs.length; i++) {
      const galleryDiv = galleryDivs[i];
      const photo = galleryDiv.querySelector('.imgDeleteForm');
      if (photo) {
        const imgSrc = photo.getAttribute('src');
        const imgAlt = photo.getAttribute('alt');
        const imgWidth = photo.getAttribute('width');
        const newImage = new Image();
        newImage.src = imgSrc;
        newImage.alt = imgAlt;
        newImage.width = imgWidth;
        newImage.classList.add('formGalleryImg');
        galleryDiv.appendChild(newImage);
      }
    }
  };
  
  createGallery();
};

document.addEventListener('DOMContentLoaded', () => {
  deleteFormGallery();
});



// Update to gallery()
updateForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the selected checkboxes
  const checkboxes = document.querySelectorAll('.checkboxUpdateForm:checked');
  const photoIds = Array.from(checkboxes).map(checkbox => checkbox.value);

  // Get the selected gallery ID
  const selectedGallery = document.querySelector('select[name="galleryId"]');
  const galleryId = selectedGallery.value;

  // Create an AJAX request
  const response = await fetch('/admin/dashboard/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoIds, galleryId }),
  });

  if (response.ok) {
    console.log('Photos gallery updated successfully');
  } else {
    console.log('Something went wrong');
  }
});


//gallery update form (works fine)
const updateFormGallery = () => {
  const availableImages = [];
  const galleryDivs = document.querySelectorAll('.galleryDiv');
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
    const galleryDivs = document.querySelectorAll('.galleryDiv');
    for (let i = 0; i < galleryDivs.length; i++) {
      const galleryDiv = galleryDivs[i];
      const photo = galleryDiv.querySelector('.imgDeleteForm');
      if (photo) {
        const imgSrc = photo.getAttribute('src');
        const imgAlt = photo.getAttribute('alt');
        const imgWidth = photo.getAttribute('width');
        const newImage = new Image();
        newImage.src = imgSrc;
        newImage.alt = imgAlt;
        newImage.width = imgWidth;
        newImage.classList.add('formGalleryImg');
        galleryDiv.appendChild(newImage);
      }
    }
  };
  createGallery();
};
document.addEventListener('DOMContentLoaded', ()=> {
  updateFormGallery()
});

//sortable js 

//sortablejs+reorder in gallery
const updatedOrderForm = document.getElementById('orderGalleryUpdateForm');
const orderGalleryContainer = document.getElementById('photoSortableContainer');
const gallerySelect = document.getElementById('gallerySelect');
gallerySelect.addEventListener('change', function(evt) {
  const selectedGalleryId = evt.target.value;

  // Clear 
  orderGalleryContainer.innerHTML = '';

  // Filter photos based on the selected gallery
  const selectedGallery = galleries.find((gallery) => gallery._id.toString() === selectedGalleryId);
  if (selectedGallery) {
    selectedGallery.photos.forEach((photo) => {
      const img = document.createElement('img');
      img.src = `/${photoBasePath}/${photo.filename}`;
      img.alt = photo.name;
      img.classList.add('imgUpdateForm');
      
      const div = document.createElement('div');
      div.classList.add('input-group');
      div.appendChild(img);

      orderGalleryContainer.appendChild(div);
    });
  }
});
  

// Get updated photo order after dragging


updatedOrderForm.addEventListener('submit', async function(evt) {
  evt.preventDefault(); // Prevent the default form submission
  //showing only imgs from selected gallery

  try {
    // Ajax request, send updatedOrder Array to server side for update order
    const response = await fetch('/admin/dashboard/updategalleryorder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedOrder }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      throw new Error('Request failed with status ' + response.status);
    }
  } catch (error) {
    console.log(error);
  }
});

Sortable.create(orderGalleryContainer, {
  animation: 250,
  swapThreshold: 0.73,
});