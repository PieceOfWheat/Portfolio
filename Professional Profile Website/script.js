const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('section');

let currentActive = 0; // track current active link

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const pageHeight = document.body.scrollHeight;

  // Check if at the bottom of the page
  if (windowHeight + scrollPosition >= pageHeight - 5) {
    if (currentActive !== navLinks.length - 1) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[navLinks.length - 1].classList.add('active');
      currentActive = navLinks.length - 1;
    }
    return; // no need to check other sections
  }

  // Loop through sections to find which is in view
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - 100; // offset for better UX
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      if (currentActive !== index) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[index].classList.add('active');
        currentActive = index;
      }
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[0].classList.add('active');
    currentActive = 0;
})
