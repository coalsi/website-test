/* Parallax Effect */
window.addEventListener('scroll', function() {
    const parallaxBackground = document.querySelector('.parallax-background');
    let scrollPosition = window.pageYOffset;
    parallaxBackground.style.backgroundPositionY = scrollPosition * 0.5 + 'px'; /* Adjust the speed of parallax */
});

/* Hover Interaction */
const hoverItems = document.querySelectorAll('.hover-item');
hoverItems.forEach(item => {
    item.addEventListener('mouseover', function() {
        item.style.transform = 'scale(1.1)';
    });
    item.addEventListener('mouseout', function() {
        item.style.transform = 'scale(1)';
    });
});

/* Lazy Load Video */
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        if (video.dataset.src) {
            video.src = video.dataset.src;
        }
    });
});

/* Full-Screen Video Effect */
const videoSection = document.querySelector('.fullscreen-video');
videoSection.addEventListener('mouseenter', () => {
    videoSection.play();
});
videoSection.addEventListener('mouseleave', () => {
    videoSection.pause();
});

/* Scroll Top to Bottom */
window.addEventListener('scroll', function() {
    const scrollImage = document.querySelector('.scroll-image');
    let scrollPosition = window.pageYOffset;
    
    // Adjust top position based on scroll with a larger multiplier for more visibility
    scrollImage.style.top = -300 + scrollPosition * 0.3 + 'px'; 
});

/* Scroll Left to Right */
window.addEventListener('scroll', function() {
    const scrollLeftRight = document.querySelector('.scroll-left-right');
    let scrollPosition = window.pageYOffset;

    // Adjust left position to move the image across the screen more gradually
    scrollLeftRight.style.left = -300 + scrollPosition * 0.5 + 'px'; 
});

/* Scroll Fade In and Out */
window.addEventListener('scroll', function() {
    const scrollFade = document.querySelector('.scroll-fade');
    const section = document.querySelector('.scroll-fade-section');
    let sectionPosition = section.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;
    
    if (sectionPosition < windowHeight) {
        scrollFade.style.opacity = '1'; /* Fades in when it enters the viewport */
    } else {
        scrollFade.style.opacity = '0'; /* Fades out when leaving the viewport */
    }
});

/* Scroll Frame Animation */
window.addEventListener('scroll', function() {
    const frames = document.querySelectorAll('.frame');
    let scrollPosition = window.pageYOffset;

    frames.forEach((frame, index) => {
        if (scrollPosition > index * 500 && scrollPosition < (index + 1) * 500) {
            frame.style.opacity = '1'; /* Shows the current frame */
        } else {
            frame.style.opacity = '0'; /* Hides other frames */
        }
    });
});