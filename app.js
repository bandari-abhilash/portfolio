const portfolioData = {
  personal: {
    name: "Abhilash Bandari",
    title: "Full Stack Developer & Chess Enthusiast",
    bio: "Passionate full-stack developer with 4+ years of experience building scalable web applications. I love solving complex problems through code and strategic thinking, both in software development and on the chess board.",
    skills: [
      "Go",
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "MongoDB",
      "PostgreSQL",
      "AWS",
      "Docker",
    ],
    social: {
      github: "https://github.com/bandari-abhilash",
      linkedin: "https://linkedin.com/in/johndeveloper",
      leetcode: "https://leetcode.com/johndeveloper",
    },
  },
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "https://github.com/johndeveloper/ecommerce",
      demo: "https://demo-ecommerce.com",
      image: "project1.jpg",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "Collaborative task management application with real-time updates",
      technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
      github: "https://github.com/johndeveloper/taskapp",
      demo: "https://taskapp-demo.com",
      image: "project2.jpg",
    },
    {
      id: 3,
      title: "Chess Analytics Dashboard",
      description:
        "Analytics dashboard for chess games with performance tracking",
      technologies: ["Python", "Flask", "D3.js", "Chess.com API"],
      github: "https://github.com/johndeveloper/chess-analytics",
      demo: "https://chess-analytics.com",
      image: "project3.jpg",
    },
  ],
  articles: [
    {
      id: 1,
      title: "Building Scalable React Applications",
      excerpt:
        "Best practices for structuring large React applications with maintainable code",
      date: "2024-01-15",
      readTime: "8 min read",
      image: "article1.jpg",
    },
    {
      id: 2,
      title: "Chess Programming: Building a Position Evaluator",
      excerpt:
        "Deep dive into chess programming concepts and position evaluation algorithms",
      date: "2024-01-10",
      readTime: "12 min read",
      image: "article2.jpg",
    },
    {
      id: 3,
      title: "Modern Database Design Patterns",
      excerpt:
        "Exploring modern approaches to database design and optimization",
      date: "2024-01-05",
      readTime: "10 min read",
      image: "article3.jpg",
    },
  ],
  chessGames: [
    {
      id: 1,
      opponent: "GrandMaster2024",
      result: "Win",
      opening: "Sicilian Defense",
      date: "2024-01-20",
      platform: "lichess",
      rating: 1850,
      gameUrl: "https://lichess.org/game123",
    },
    {
      id: 2,
      opponent: "ChessWarrior",
      result: "Draw",
      opening: "Queen's Gambit",
      date: "2024-01-18",
      platform: "chess.com",
      rating: 1825,
      gameUrl: "https://chess.com/game456",
    },
    {
      id: 3,
      opponent: "TacticalMaster",
      result: "Win",
      opening: "King's Indian Defense",
      date: "2024-01-15",
      platform: "lichess",
      rating: 1875,
      gameUrl: "https://lichess.org/game789",
    },
  ],
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupTypingAnimation();
  setupScrollAnimations();
  setupSkillBars();
  populateProjects();
  populateArticles();
  populateChessGames();
  setupProjectFilters();
  setupContactForm();
  setupSmoothScrolling();
}

// Smooth scrolling functionality
function setupSmoothScrolling() {
  // Handle all anchor links
  document.addEventListener("click", function (e) {
    // Check if clicked element is a link with href starting with #
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Close mobile menu if open
        const navMenu = document.getElementById("nav-menu");
        const navToggle = document.getElementById("nav-toggle");
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          navToggle.classList.remove("active");
        }

        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update active nav link
        updateActiveNavLink();
      }
    }
  });
}

// Navigation functionality
function setupNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // Update active nav link based on scroll position
  window.addEventListener("scroll", updateActiveNavLink);

  // Initial call to set active link
  updateActiveNavLink();
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100; // Account for navbar height
    const sectionBottom = sectionTop + section.offsetHeight;

    if (
      window.pageYOffset >= sectionTop &&
      window.pageYOffset < sectionBottom
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Typing animation for hero section
function setupTypingAnimation() {
  const nameElement = document.querySelector(".name");
  if (!nameElement) return;

  const text = nameElement.textContent;
  nameElement.textContent = "";
  nameElement.classList.remove("typing-animation");

  let i = 0;
  const typeTimer = setInterval(() => {
    if (i < text.length) {
      nameElement.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typeTimer);
      // Add typing animation class for blinking cursor
      nameElement.classList.add("typing-animation");
    }
  }, 100);
}

// Scroll animations using Intersection Observer
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Add fade-in class to elements that should animate
  const animateElements = document.querySelectorAll(
    ".project-card, .article-card, .chess-card, .skill-item",
  );
  animateElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
}

// Skill bars animation
function setupSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillProgress = entry.target;
          const progress = skillProgress.getAttribute("data-progress");
          setTimeout(() => {
            skillProgress.style.width = progress + "%";
          }, 200);
        }
      });
    },
    { threshold: 0.5 },
  );

  skillBars.forEach((bar) => {
    observer.observe(bar);
  });
}

// Populate projects
function populateProjects() {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) return;

  const projectsHTML = portfolioData.projects
    .map(
      (project) => `
    <div class="project-card fade-in" data-technologies='${JSON.stringify(project.technologies)}'>
      <div class="project-image">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
        </div>
        <div class="project-links">
          <a href="${project.demo}" target="_blank" class="project-link project-link--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15,3 21,3 21,9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Live Demo
          </a>
          <a href="${project.github}" target="_blank" class="project-link project-link--secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  projectsGrid.innerHTML = projectsHTML;
}

// Populate articles
function populateArticles() {
  const articlesGrid = document.getElementById("articles-grid");
  if (!articlesGrid) return;

  const articlesHTML = portfolioData.articles
    .map(
      (article) => `
    <div class="article-card fade-in">
      <div class="article-image">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      </div>
      <div class="article-content">
        <h3 class="article-title">${article.title}</h3>
        <p class="article-excerpt">${article.excerpt}</p>
        <div class="article-meta">
          <span>${formatDate(article.date)}</span>
          <span>${article.readTime}</span>
        </div>
        <a href="#" class="article-link">Read More →</a>
      </div>
    </div>
  `,
    )
    .join("");

  articlesGrid.innerHTML = articlesHTML;
}

// Populate chess games
function populateChessGames() {
  const chessGrid = document.getElementById("chess-grid");
  if (!chessGrid) return;

  const chessHTML = portfolioData.chessGames
    .map(
      (game) => `
    <div class="chess-card fade-in">
      <div class="chess-header">
        <h4 class="chess-opponent">vs ${game.opponent}</h4>
        <span class="chess-result chess-result--${game.result.toLowerCase()}">${game.result}</span>
      </div>
      <div class="chess-details">
        <div class="chess-detail">
          <span>Opening:</span>
          <span>${game.opening}</span>
        </div>
        <div class="chess-detail">
          <span>Date:</span>
          <span>${formatDate(game.date)}</span>
        </div>
        <div class="chess-detail">
          <span>Platform:</span>
          <span>${game.platform}</span>
        </div>
        <div class="chess-detail">
          <span>Rating:</span>
          <span>${game.rating}</span>
        </div>
      </div>
      <a href="${game.gameUrl}" target="_blank" class="chess-link">View Game →</a>
    </div>
  `,
    )
    .join("");

  chessGrid.innerHTML = chessHTML;
}

// Project filtering
function setupProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      const projectCards = document.querySelectorAll(".project-card");

      projectCards.forEach((card) => {
        const technologies = JSON.parse(
          card.getAttribute("data-technologies") || "[]",
        );

        if (filter === "all" || technologies.includes(filter)) {
          card.style.display = "block";
          card.style.animation = "fadeInUp 0.5s ease-out";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Contact form
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(data.email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    // Simulate form submission
    showNotification(
      "Message sent successfully! I'll get back to you soon.",
      "success",
    );
    contactForm.reset();
  });
}

// Utility functions
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === "success" ? "var(--color-success)" : "var(--color-error)"};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-weight: 500;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
  `;
  notification.textContent = message;

  // Add animation styles if not already present
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Navbar background on scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});

// Handle window resize
window.addEventListener("resize", function () {
  // Close mobile menu on resize
  if (window.innerWidth > 768) {
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");
    if (navMenu && navToggle) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  }
});

// Add loading animation
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});
