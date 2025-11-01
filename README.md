# Digital Defense Checklist

<p align="center">
  <em>An interactive, customizable, and data-driven dashboard to help you secure your digital life and protect your privacy.</em>
</p>

<p align="center">
  <img src="https://i.ibb.co/rGQK71g/personal-security-checklist-6.png" alt="A screenshot of the Digital Defense Checklist dashboard, showing progress meters, charts, and security categories." width="700" />
</p>

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](/LICENSE)

This application provides a comprehensive personal security checklist, presented as a beautiful and interactive dashboard. Track your progress, learn about crucial security topics, and customize the entire checklist to fit your needs using the built-in admin panel.

## ✨ Core Features

- **Interactive Dashboard**: Visualize your security posture at a glance with progress bars, circular meters, and a detailed radar chart.
- **Comprehensive Checklist**: Based on the highly-regarded [personal-security-checklist](https://github.com/Lissy93/personal-security-checklist), covering 12 key security categories.
- **State Persistence**: Your progress is automatically saved to your browser's local storage, so your session is never lost.
- **Responsive Design**: A clean, modern UI that works flawlessly on desktop, tablets, and mobile devices.
- **Advanced Filtering**: Drill down into specific categories and filter checklist items by status (Done, Ignored), priority level, or a full-text search.
- **No Build Step**: Runs directly in the browser using modern ES Modules and Import Maps.

---

## 🔐 Admin Content Management System

Log in as an administrator to unlock a full suite of content management tools, turning the checklist into a powerful, customizable platform.

- **Secure Admin Login**: Access admin features through a password-protected modal.
- **Full CRUD for Categories**:
  - **Create**: Add new security categories with a custom title, description, color, and icon.
  - **Update**: Edit the details of any existing category.
  - **Delete**: Remove entire categories (and all their items) with a confirmation.
- **Full CRUD for Checklist Items**:
  - **Create**: Add new security advice to any category.
  - **Update**: Edit the title, description, and priority level of any item.
  - **Delete**: Remove individual checklist items.

## 💾 Data Management & Sync

Administrators have powerful tools to manage the checklist data:

- **Import & Export**:
  - **Export**: Download the entire current state of your checklist as a single JSON file for backup or sharing.
  - **Import**: Upload a JSON backup file to completely overwrite the current checklist.
- **Two-Way GitHub Sync**:
  - **Push to GitHub**: Save your checklist data directly to a file in a GitHub repository. Requires a Personal Access Token (PAT) for authentication.
  - **Pull from GitHub**: Fetch the checklist data from your GitHub repository to update your local application, enabling version control and collaboration.

## 🚀 Getting Started

This project is designed for simplicity and requires no build tools.

1.  Clone or download the repository.
2.  Open the `index.html` file in a modern web browser (like Chrome, Firefox, or Edge).
3.  That's it! The application will run locally.

### Accessing Admin Features

1.  Click the **"Admin Login"** button in the header.
2.  Enter the password: `password`
3.  Once logged in, you will see new "Admin Tools" on the dashboard and Edit/Delete controls throughout the application.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **Charts**: Recharts
- **Module System**: Native ES Modules with Import Maps (no Webpack, Vite, etc.)

## 🙏 Acknowledgements

The initial data for this checklist is sourced from the incredible open-source project [personal-security-checklist](https://github.com/Lissy93/personal-security-checklist) by [Alicia Sykes (Lissy93)](https://github.com/Lissy93). This interactive dashboard is a tribute to and an extension of that invaluable resource.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-repo/your-project/issues).

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
