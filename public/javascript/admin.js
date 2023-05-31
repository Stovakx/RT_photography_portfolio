
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



//update to gallery(works fine)
const updateForm = document.getElementById('updateForm');
console.log('Update Event listener attached');

// Attach an event listener to the form submission
updateForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the selected checkboxes
  const checkboxes = document.querySelectorAll('.checkboxUpdateForm:checked');
  const photoIds = Array.from(checkboxes).map(checkbox => checkbox.value);
  console.log(photoIds)
  // Create an AJAX request
  const response = await fetch('/admin/dashboard/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoIds })
  });

  console.log(response);

  if (response.ok) {
    window.location.reload();
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
})

//update order of specific gallery (masonry layout or something like that?)
const updateOrderInGalleryForm = document.getElementById('orderGalleryUpdateForm')
console.log('Order gallery update listener attached')

//attach listener
updateOrderInGalleryForm.addEventListener('submit', async (event) =>{
  event.preventDefault();

})
//sortable js 
const orderGalleryContainer = document.getElementById('photoSortableContainer')
Sortable.create(orderGalleryContainer, {
  onEnd: function(evt){
    //Get updated photo order after dragging
    const updatedOrder = Array.from(orderGalleryContainer.querySelectorAll('.galleryDiv')).map((div)=>
      div.getAttribute('data-photo-id')
    )

    //ajax request, send updatedOreder Array to server side for update order
    //Using fetch
    fetch('/admin/dashboard/updategalleryorder', {
      method: 'PUT',
      headers: {
        'Conten-Type': 'application/json',
      },
      body: JSON.stringify({ order: updatedOrder}),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error)=> {
      console.log(error)
    })
  }
})
//rewrite galleries for update and delete to one gallery function and just use in specific gallery