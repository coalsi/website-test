document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM fully loaded and parsed');

    // =========================================
    // Scroll Arrow Functionality
    // =========================================
    const sections = document.querySelectorAll("section");
    const scrollArrow = document.getElementById("scrollArrow");
    let currentSection = 0;

    if (scrollArrow) {
        scrollArrow.addEventListener("click", function() {
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                currentSection = (currentSection + 1) % sections.length;
                sections[currentSection].scrollIntoView({ behavior: "smooth" });
            }
        });

        let scrollTimeout;
        window.addEventListener("scroll", function() {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2) {
                    scrollArrow.innerHTML = `<i class="fas fa-arrow-up"></i>`;
                } else {
                    scrollArrow.innerHTML = `<i class="fas fa-arrow-down"></i>`;
                }
            }, 100);
        });
    }



    // =========================================
    // Header Scroll Effect
    // =========================================
    const scrollThreshold = 100;
    const header = document.querySelector('.menu ul');
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // =========================================
    // "I am" Section Word Rotator
    // =========================================
    const words = ["Corey Silvia.", "a Videographer.", "a Photographer.", "a Designer.", "a Spotter.", "a Strategist.", "a Co-Driver.", "a CTO.", "a Fabricator."];
    let wordIndex = 0;

    function changeWord() {
        const wordElement = document.getElementById('changing-words');
        if (wordElement) {
            const currentWord = words[wordIndex];
            if (currentWord.startsWith("a ") || currentWord.startsWith("an ")) {
                const [firstWord, ...rest] = currentWord.split(" ");
                wordElement.innerHTML = `<span class="special-letter">${firstWord}</span> ${rest.join(" ")}`;
            } else {
                wordElement.textContent = currentWord;
            }
            wordIndex = (wordIndex + 1) % words.length;
            const delay = wordIndex === 1 ? 3000 : 750;
            setTimeout(changeWord, delay);
        }
    }
    changeWord(); // Start word rotation

    // =========================================
    // Client Slider Initialization
    // =========================================
    function setupClientSlider() {
        const slides = document.querySelectorAll('.client-slide');
        if (slides.length === 0) return;
        let currentSlide = 0;

        function showNextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // Change slide every 5 seconds
        setInterval(showNextSlide, 5000);
    }
    setupClientSlider();

    // =========================================
    // Contact Form Submission Handling
    // =========================================
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Show a loading message
            modalMessage.textContent = 'Sending message...';
            successModal.style.display = 'flex';

            // Collect form data
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                modalMessage.textContent = text;
                successModal.style.display = 'flex';

                const timeout = 3000;
                setTimeout(() => {
                    successModal.style.display = 'none';
                }, timeout);

                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                modalMessage.textContent = 'An error occurred. Please try again later.';
                successModal.style.display = 'flex';

                setTimeout(() => {
                    successModal.style.display = 'none';
                }, 10000);
            });
        });
    }

    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const refreshButton = document.querySelector('.refresh-btn'); // New refresh button

    let fullGalleryOrder = []; // Stores the randomized full gallery order
    let filteredImages = []; // Holds currently visible images in the correct order for the modal
    let currentImageIndex = 0;
    let currentFilter = 'all'; // Track the current active filter

    // Check if a randomized order is already stored in localStorage
    let savedOrder = localStorage.getItem('randomizedOrder');

    if (!savedOrder) {
        // If no order is saved, randomize the gallery
        randomizeAndStoreOrder();
    } else {
        // If order is saved, apply the saved order
        savedOrder = JSON.parse(savedOrder);
        applySavedOrder(savedOrder);
    }

    // =========================================
    // Randomize and Store Image Order
    // =========================================
    function randomizeAndStoreOrder() {
        const itemsArray = Array.from(galleryItems);
        const randomizedOrder = [];

        for (let i = itemsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [itemsArray[i], itemsArray[j]] = [itemsArray[j], itemsArray[i]];
        }

        // Append items to the grid in the new order and save the order
        itemsArray.forEach(item => {
            galleryGrid.appendChild(item);
            randomizedOrder.push(item.querySelector('img').src); // Save the image src to maintain order
        });

        fullGalleryOrder = itemsArray; // Save the full gallery order for filtering
        localStorage.setItem('randomizedOrder', JSON.stringify(randomizedOrder));
        applyFilter(currentFilter); // Apply current filter after reordering
    }

    // =========================================
    // Apply Saved Image Order
    // =========================================
    function applySavedOrder(savedOrder) {
        const itemsArray = Array.from(galleryItems);
        itemsArray.sort((a, b) => {
            const srcA = a.querySelector('img').src;
            const srcB = b.querySelector('img').src;
            return savedOrder.indexOf(srcA) - savedOrder.indexOf(srcB);
        });

        fullGalleryOrder = itemsArray; // Save the sorted order as the full gallery order
        itemsArray.forEach(item => galleryGrid.appendChild(item));
        applyFilter(currentFilter); // Apply current filter after loading saved order
    }

    // =========================================
    // Apply Filter to the Gallery
    // =========================================
    function applyFilter(category) {
        let visibleImages = []; // To store the filtered images in correct order

        fullGalleryOrder.forEach(item => {
            const itemCategories = item.getAttribute('data-category').split(' ');
            if (category === 'all' || itemCategories.includes(category)) {
                item.style.display = 'block'; // Show the item
                visibleImages.push(item); // Add visible items to the array
            } else {
                item.style.display = 'none'; // Hide the item
            }
        });

        // Update `filteredImages` with the visible images in their current order
        filteredImages = visibleImages.map(item => item.querySelector('img'));
    }

    // =========================================
    // Filter Button Functionality
    // =========================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            currentFilter = category; // Store the current filter
            applyFilter(category);

            // Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // =========================================
    // Modal Functionality for Filtered Gallery
    // =========================================
    const overlay = document.getElementById("imageOverlay");
    const fullImage = document.getElementById("fullImage");
    const imageDescription = document.getElementById("imageDescription");
    const closeOverlay = document.querySelector(".close-overlay");
    const prevArrow = document.querySelector(".prev-arrow");
    const nextArrow = document.querySelector(".next-arrow");

    function openModal(index) {
        currentImageIndex = index;
        const img = filteredImages[currentImageIndex];
        fullImage.src = img.src;
        imageDescription.textContent = img.alt;
        overlay.classList.add('active');
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        const img = filteredImages[currentImageIndex];
        fullImage.src = img.src;
        imageDescription.textContent = img.alt;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        const img = filteredImages[currentImageIndex];
        fullImage.src = img.src;
        imageDescription.textContent = img.alt;
    }

    galleryItems.forEach((item) => {
        const img = item.querySelector('img');
        img.addEventListener('click', function () {
            const filteredIndex = filteredImages.indexOf(img);
            if (filteredIndex !== -1) {
                openModal(filteredIndex);
            }
        });
    });

    closeOverlay.addEventListener('click', function () {
        overlay.classList.remove('active');
    });

    prevArrow.addEventListener('click', function () {
        showPrevImage();
    });

    nextArrow.addEventListener('click', function () {
        showNextImage();
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (overlay.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'Escape') {
                overlay.classList.remove('active');
            }
        }
    });

    // =========================================
    // Reset Randomized Order
    // =========================================
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            localStorage.removeItem('randomizedOrder'); // Remove the saved order
            randomizeAndStoreOrder(); // Re-randomize the gallery
        });
    }
	
});