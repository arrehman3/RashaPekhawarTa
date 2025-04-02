import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { LOCATIONS } from '../locations';

export function initializeGallery(containerId) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#' + containerId,
    children: 'a',
    pswpModule: PhotoSwipe
  });
  
  lightbox.init();
  
  const container = document.getElementById(containerId);
  container.className = 'gallery-container';
  
  LOCATIONS.forEach(location => {
    const link = document.createElement('a');
    link.href = location.img;
    link.dataset.pswpWidth = location.width;
    link.dataset.pswpHeight = location.height;
    
    const thumb = document.createElement('img');
    thumb.src = location.img;
    thumb.alt = location.title;
    thumb.className = 'gallery-thumb';
    
    const caption = document.createElement('div');
    caption.className = 'gallery-caption';
    caption.textContent = location.title;
    
    link.appendChild(thumb);
    link.appendChild(caption);
    container.appendChild(link);
  });
}