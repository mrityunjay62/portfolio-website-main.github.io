// htmlcss progress circular bar 
const htmlProgress = document.querySelector(".html-css");
const htmlValue = document.querySelector(".html-progress");

if (htmlProgress && htmlValue) {
  let htmlStartValue = 0,
    htmlEndValue = 90,
    htmlspeed = 30;

  const progresshtml = setInterval(() => {
    htmlStartValue++;

    htmlValue.textContent = `${htmlStartValue}%`;
    htmlProgress.style.background = `conic-gradient(#fca61f ${
      htmlStartValue * 3.6
    }deg, #ededed 0deg)`;

    if (htmlStartValue === htmlEndValue) {
      clearInterval(progresshtml);
    }
  }, htmlspeed);
}

// javasript progress circular bar 
const javascriptProgress = document.querySelector(".javascript");
const javascriptValue = document.querySelector(".javascript-progress");

if (javascriptProgress && javascriptValue) {
  let javascriptStartValue = 0,
    javascriptEndValue = 75,
    jsspeed = 30;

  const progressjs = setInterval(() => {
    javascriptStartValue++;

    javascriptValue.textContent = `${javascriptStartValue}%`;
    javascriptProgress.style.background = `conic-gradient(#7d2ae8 ${
      javascriptStartValue * 3.6
    }deg, #ededed 0deg)`;

    if (javascriptStartValue === javascriptEndValue) {
      clearInterval(progressjs);
    }
  }, jsspeed);
}

// php progress circular bar 
const phpProgress = document.querySelector(".php");
const phpValue = document.querySelector(".php-progress");

if (phpProgress && phpValue) {
  let phpStartValue = 0,
    phpEndValue = 90,
    phpspeed = 30;

  const progressphp = setInterval(() => {
    phpStartValue++;

    phpValue.textContent = `${phpStartValue}%`;
    phpProgress.style.background = `conic-gradient(#20c997 ${
      phpStartValue * 3.6
    }deg, #ededed 0deg)`;

    if (phpStartValue === phpEndValue) {
      clearInterval(progressphp);
    }
  }, phpspeed);
}

// reactjs progress circular bar 
const djangoProgress = document.querySelector(".django");
const djangoValue = document.querySelector(".django-progress");

if (djangoProgress && djangoValue) {
  let djangoStartValue = 0,
    djangoEndValue = 80,
    djangospeed = 30;

  const progressdjango = setInterval(() => {
    djangoStartValue++;

    djangoValue.textContent = `${djangoStartValue}%`;
    djangoProgress.style.background = `conic-gradient(#3f396d ${
      djangoStartValue * 3.6
    }deg, #ededed 0deg)`;

    if (djangoStartValue === djangoEndValue) {
      clearInterval(progressdjango);
    }
  }, djangospeed);
}


// filter using javascript
$(document).ready(function () {
  $(".filter-item").click(function () {
    const value = $(this).attr("data-filter");
    if (value === "all") {
      $(".post").show("1000");
    } else {
      $(".post")
        .not("." + value)
        .hide("1000");
      $(".post")
        .filter("." + value)
        .show("1000");
    }
  });
});


// javascript for sticky navbar even if u scroll the navbar will be fixed
document.addEventListener("DOMContentLoaded", function(){
  const navbar = document.getElementById('navbar-top');
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;

  window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar?.classList.add('fixed-top');
        document.body.style.paddingTop = navbarHeight + 'px';
      } else {
        navbar?.classList.remove('fixed-top');
        document.body.style.paddingTop = '0';
      } 
  });
}); 


// adding funtionality to back to top button 

//Get the button
const mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    if (mybutton) {
      mybutton.style.display = "block";
    }
  } else {
    if (mybutton) {
      mybutton.style.display = "none";
    }
  }
}
// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const mobile = document.getElementById('mobile')?.value || '';
    const message = document.getElementById('message')?.value || '';

    fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, mobile, message })
    })
    .then(response => response.text())
    .then(data => {
      document.getElementById('responseMessage').innerHTML = `<p class="text-success">${data}</p>`;
      contactForm.reset();
    })
    .catch(error => {
      document.getElementById('responseMessage').innerHTML = `<p class="text-danger">Error sending message. Please try again.</p>`;
      console.error('Error:', error);
    });
  });
}

// Dark mode toggle
const toggleButton = document.getElementById('dark-mode-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

if (toggleButton) {
  if (currentTheme === 'dark') {
    toggleButton.innerHTML = '<i class="bi bi-sun-fill"></i>';
  } else {
    toggleButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }

  toggleButton.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      toggleButton.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      toggleButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
    }
  });
}

// Typing effect
const typingText = document.getElementById('typing-text');
const text = "AI-focused Computer Science graduate with strong hands-on experience in Python, Django, REST APIs, and LLM-powered backend systems. Specialized in Agentic AI workflows, Prompt Engineering, and Retrieval-Augmented Generation (RAG). Experienced in building domain-specific AI chatbots, designing tool-using agents, and optimizing prompts for accuracy, safety, and structured outputs. Actively seeking AI Developer / Agentic AI Engineer / Prompt Engineer roles.";
let index = 0;

function typeWriter() {
  if (typingText && index < text.length) {
    typingText.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, 50);
  }
}

window.addEventListener('load', typeWriter);