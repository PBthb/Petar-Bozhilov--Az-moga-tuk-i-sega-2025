document.addEventListener('DOMContentLoaded', () => {
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = mobileNav.querySelectorAll('.nav-link');
    const buyTicketBtns = document.querySelectorAll('.buy-ticket-btn');


    const ticketModal = document.getElementById('ticket-modal');
    const closeModalBtn = ticketModal.querySelector('.modal-close-button');
    const modalSteps = ticketModal.querySelectorAll('.modal-step');
    const ticketChoices = ticketModal.querySelectorAll('.ticket-choice');
    const backBtns = ticketModal.querySelectorAll('.step-back-btn');
    const ticketForm = document.getElementById('ticket-form');


    const heroImageBg = document.getElementById('hero-image-bg');
    const authorImage = document.getElementById('author-image');
    const authorBio = document.getElementById('author-bio');
    const paintingsContainer = document.getElementById('paintings-container');


    let currentTicket = {};


    const toggleNav = () => mobileNav.classList.toggle('active');
    navToggleBtn.addEventListener('click', toggleNav);
    navLinks.forEach(link => link.addEventListener('click', toggleNav));


    const goToStep = (stepNumber) => {
        modalSteps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step${stepNumber}-choose`)?.classList.add('active');
        document.getElementById(`step${stepNumber}-details`)?.classList.add('active');
        document.getElementById(`step${stepNumber}-qr`)?.classList.add('active');
    };

    const showModal = (ticketType = null) => {
        ticketModal.classList.add('visible');
        if (ticketType) {
            const price = ticketType === 'Standard' ? 12 : 8;
            currentTicket = { type: ticketType, price };
            document.getElementById('form-ticket-title').textContent = `${ticketType} Ticket`;
            goToStep(2);
        } else {
            goToStep(1);
        }
    };

    const hideModal = () => ticketModal.classList.remove('visible');


    buyTicketBtns.forEach(btn => btn.addEventListener('click', (e) => {
        const ticketType = e.currentTarget.dataset.ticketType;
        showModal(ticketType);
    }));
    closeModalBtn.addEventListener('click', hideModal);
    ticketModal.addEventListener('click', (e) => {
        if (e.target === ticketModal) hideModal();
    });


    ticketChoices.forEach(choice => {
        choice.addEventListener('click', (e) => {
            const { ticketType, price } = e.currentTarget.dataset;
            currentTicket = { type: ticketType, price };
            document.getElementById('form-ticket-title').textContent = `${ticketType} Ticket`;
            goToStep(2);
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetStep = e.currentTarget.dataset.targetStep;
            goToStep(targetStep);
        });
    });

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(ticketForm);
        currentTicket.name = formData.get('name');
        currentTicket.email = formData.get('email');

        const qrData = `Ticket: ${currentTicket.type}, Name: ${currentTicket.name}, Price: €${currentTicket.price}`;
        const qrImg = document.getElementById('qr-code-img');
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;

        document.getElementById('qr-ticket-title').textContent = `Покупка за ${currentTicket.name}`;
        goToStep(3);
    });


    async function populatePage() {
        const [artists, paintings] = await Promise.all([fetchArtists(), fetchPaintings()]);

        if (!artists.length || !paintings.length) {
            console.error("Failed to fetch necessary data.");
            return;
        }


        const ivanMilev = artists.find(artist => artist.id === 1);
        if (ivanMilev) {
            authorImage.style.backgroundImage = `url(${ivanMilev.imageUrl})`;
            authorBio.textContent = ivanMilev.bio;
        }


        const ahinoraPainting = paintings.find(p => p.id === 1);
        if (ahinoraPainting) {
            heroImageBg.style.backgroundImage = `url(${ahinoraPainting.imageUrl})`;
        }


        paintingsContainer.innerHTML = '';
        paintings.forEach(painting => {
            const paintingEl = document.createElement('div');
            paintingEl.className = 'painting-item';
            paintingEl.innerHTML = `
                    <h3>${painting.title}</h3>
                    <img src="${painting.imageUrl}" alt="${painting.title}" loading="lazy">
                    <p>${painting.description}</p>
                `;
            paintingsContainer.appendChild(paintingEl);
        });
    }

    populatePage();
});