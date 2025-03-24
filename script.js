document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.querySelector('.gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const totalImages = 17; // Numero di immagini esistenti
    const newImagesCount = 7; // Numero di nuove immagini da aggiungere dalla cartella "statue"

    // Crea il popup per il video
    const videoPopup = document.createElement('div');
    videoPopup.id = 'video-popup';
    videoPopup.style.display = 'none';
    videoPopup.style.position = 'fixed';
    videoPopup.style.top = '0';
    videoPopup.style.left = '0';
    videoPopup.style.width = '100%';
    videoPopup.style.height = '100%';
    videoPopup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    videoPopup.style.zIndex = '1000';

    const videoContainer = document.createElement('div');
    videoContainer.style.position = 'relative';
    videoContainer.style.width = '80%';
    videoContainer.style.height = '80%';
    videoContainer.style.margin = 'auto';
    videoContainer.style.display = 'flex';
    videoContainer.style.justifyContent = 'center';
    videoContainer.style.alignItems = 'center';

    const videoElement = document.createElement('video');
    videoElement.id = 'popup-video';
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.objectFit = 'contain';

    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.bottom = '10px';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.justifyContent = 'space-between';
    controlsContainer.style.width = '100%';
    controlsContainer.style.padding = '0 20px';

    const restartButton = document.createElement('button');
    restartButton.textContent = '⟲';
    restartButton.title = 'Riavvia';
    restartButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    `;
    restartButton.addEventListener('click', () => {
        videoElement.currentTime = 0;
        videoElement.play();
    });

    const homeButton = document.createElement('button');
    homeButton.innerHTML = '&#8962;'; // Icona della casa
    homeButton.title = 'Torna alla Home';
    homeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    `;
    homeButton.addEventListener('click', () => {
        videoPopup.style.display = 'none';
        videoElement.pause();
        videoElement.src = '';
    });

    controlsContainer.appendChild(restartButton);
    controlsContainer.appendChild(homeButton);

    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(controlsContainer);
    videoPopup.appendChild(videoContainer);
    document.body.appendChild(videoPopup);

    // Aggiungi immagini esistenti
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement('img');
        img.src = `immagini/${i}.jpg`; // Percorso immagine
        img.alt = `Immagine ${i}`;
        gallery.appendChild(img);
    }

    // Aggiungi nuove immagini dalla cartella "statue"
    for (let i = 1; i <= newImagesCount; i++) {
        const img = document.createElement('img');
        img.src = `immagini/statue${i}.jpg`; // Percorso delle nuove immagini
        img.alt = `Statua ${i}`;
        img.dataset.videoSrc = `video/video${i}.mp4`; // Percorso del video
        img.addEventListener('click', function () {
            videoElement.src = img.dataset.videoSrc;
            videoPopup.style.display = 'flex';
            videoElement.play();
        });
        gallery.appendChild(img);
    }

    // Gestione clic sul video nella pagina
    const pageVideoElement = document.getElementById('canovaVideo');
    if (pageVideoElement) {
        pageVideoElement.addEventListener('click', function () {
            if (pageVideoElement.paused) {
                pageVideoElement.play();
            } else {
                pageVideoElement.pause();
            }
        });
    }

    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let initialDistance = 0, currentScale = 1;

    // Eventi per la lightbox e il touch
    if (gallery) {
        gallery.addEventListener('dblclick', function (e) {
            if (e.target.tagName === 'IMG') {
                lightboxImg.src = e.target.src;
                lightbox.style.display = 'flex';
            }
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target !== lightboxImg) {
                lightbox.style.display = 'none';
                resetTransform();
            }
        });
    }

    if (lightboxImg) {
        lightboxImg.addEventListener('touchstart', function (e) {
            const touches = e.touches;
            if (touches.length === 1) {
                startX = touches[0].clientX - currentX;
                startY = touches[0].clientY - currentY;
            } else if (touches.length === 2) {
                initialDistance = getDistance(touches[0], touches[1]);
            }
        });

        lightboxImg.addEventListener('touchmove', function (e) {
            e.preventDefault();
            const touches = e.touches;
            if (touches.length === 1 && initialDistance === 0) {
                const touch = touches[0];
                currentX = touch.clientX - startX;
                currentY = touch.clientY - startY;
                updateTransform();
            } else if (touches.length === 2) {
                const newDistance = getDistance(touches[0], touches[1]);
                const scaleChange = newDistance / initialDistance;
                currentScale = Math.min(Math.max(currentScale * scaleChange, 1), 5);
                initialDistance = newDistance;
                updateTransform();
            }
        });

        lightboxImg.addEventListener('touchend', function (e) {
            if (e.touches.length < 2) {
                initialDistance = 0;
            }
        });
    }

    function getDistance(touch1, touch2) {
        return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
    }

    function updateTransform() {
        if (lightboxImg) {
            lightboxImg.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
        }
    }

    function resetTransform() {
        currentX = 0;
        currentY = 0;
        currentScale = 1;
        if (lightboxImg) {
            lightboxImg.style.transform = 'translate(0, 0) scale(1)';
        }
    }
});
