// Simple enhancements – run after page load
window.addEventListener('load', () => {

    console.log("Interview prep loaded. Good luck!");
    
    // Example: count questions
    const cards = document.querySelectorAll('.card');
    console.log(`Total questions: ${cards.length}`);
});