document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();

            // Calculate mouse position relative to the card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Get the card's center coordinates
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angles
            const rotateX = ((y - centerY) / centerY) * -10; // Tilt up/down
            const rotateY = ((x - centerX) / centerX) * 10;  // Tilt left/right

            // Apply tilt to the card
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            // Reset tilt
            card.style.transform = "rotateX(0deg) rotateY(0deg)";
            card.style.transition = "transform 0.3s ease-out"; // Smooth reset
        });
    });
});
