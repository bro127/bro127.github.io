const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const savedImage = localStorage.getItem('bkhawkProfileImage');
function applyImage(imgId, fallbackId, src){
  const img = document.getElementById(imgId);
  const fallback = document.getElementById(fallbackId);
  if (!img || !fallback) return;
  if (src) {
    img.src = src;
    img.style.display = 'block';
    fallback.style.display = 'none';
  } else {
    img.removeAttribute('src');
    img.style.display = 'none';
    fallback.style.display = 'grid';
  }
}
applyImage('profileImage', 'imageFallback', savedImage);
applyImage('adminPreview', 'adminFallback', savedImage);

let selectedImage = null;
const upload = document.getElementById('imageUpload');
if (upload) {
  upload.addEventListener('change', () => {
    const file = upload.files && upload.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      selectedImage = reader.result;
      applyImage('adminPreview', 'adminFallback', selectedImage);
    };
    reader.readAsDataURL(file);
  });
}

const saveBtn = document.getElementById('saveImage');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    if (!selectedImage) return alert('Choose an image first.');
    localStorage.setItem('bkhawkProfileImage', selectedImage);
    alert('Image saved on this browser. Open homepage to see it.');
  });
}

const clearBtn = document.getElementById('clearImage');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('bkhawkProfileImage');
    selectedImage = null;
    applyImage('adminPreview', 'adminFallback', null);
    alert('Image cleared.');
  });
}
