/* Edit only confirmed information here. Empty URLs are never rendered as links. */
window.portfolioData = {
  githubUrl: "https://github.com/ino-noel",
  showGpa: false,
  gpa: "3.32 / 4.00",
  featuredProject: {
    repositoryUrl: "https://github.com/ClaudiaVidya/machine-learning",
    demoUrl: ""
  },
  // Images are optional. Only PTI uses the original screenshot supplied by Noel.
  otherProjects: [
    {
      title: "Digital Library Service System",
      description: "A web-based library service built around book lending, room reservations, and user accounts, using Node.js and MySQL.",
      technologies: ["JavaScript", "Node.js", "MySQL"],
      features: ["Book lending and room reservations", "User account management"],
      repositoryUrl: "https://github.com/hhoow0093/Perpustakaan-Layanan-Digital"
    },
    {
      title: "Comifuro E-Commerce & Management System",
      description: "An e-commerce and management prototype with a product catalog, shopping cart, checkout, and role-based tools for managing products and orders.",
      technologies: ["JavaScript", "CSS", "HTML", "Node.js", "MySQL"],
      features: ["Product browsing, shopping cart, and checkout", "Role-based product and order management"],
      repositoryUrl: "https://github.com/ino-noel/comifuro-app-UAS"
    },
    {
      title: "PTI — Lah Kok Ada",
      description: "A browser-based game where players choose a character, explore a village, manage an inventory, and interact with buildings.",
      technologies: ["React.js", "JavaScript", "CSS"],
      features: ["Character selection and village exploration", "Inventory and building interactions"],
      image: "assets/images/pti-lah-kok-ada.jpg",
      imageAlt: "Lah Kok Ada gameplay showing a village map, player character, inventory panel, and movement controls.",
      imageWidth: 1600,
      imageHeight: 728,
      repositoryUrl: "https://github.com/RenYamaa/Lah-Kok-Ada",
      demoUrl: "https://lahkokada.netlify.app/"
    }
  ]
};
