# Inventory Management System

A modern, responsive web application for managing inventory, products, orders, and suppliers.

## Features

- **Dashboard**: Overview of key inventory metrics with visual charts
- **Inventory Management**: Track stock levels, locations, and statuses
- **Product Management**: Manage product details, categories, and pricing
- **Order Management**: Process and track customer orders
- **Supplier Management**: Manage supplier information and relationships
- **Reporting**: Generate reports and analytics on inventory performance

## Technologies Used

- **React**: UI library for building the frontend
- **React Router**: For navigation between pages
- **Material UI**: Component library for responsive design
- **Chart.js**: For data visualization
- **Formik & Yup**: For form management and validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository or download the source code
2. Navigate to the project directory

```bash
cd "Inventory Management System"
```

3. Install dependencies

```bash
npm install
# or
yarn install
```

4. Start the development server

```bash
npm start
# or
yarn start
```

5. Open your browser and visit `http://localhost:3000`

## Usage

### Login

- For demo purposes, you can log in with any email and password

### Navigation

- Use the sidebar to navigate between different sections of the application
- The top navbar provides access to user settings and notifications

## Project Structure

```
inventory-management-system/
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── styles/          # CSS styles
│   ├── utils/           # Utility functions
│   ├── api/             # API service functions
│   ├── models/          # Data models
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
└── package.json         # Dependencies and scripts
```

## Customization

- Modify the theme in `src/App.js` to change the color scheme
- Add more components and pages as needed for your specific requirements
- Implement real API integration by updating the functions in the `api` directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)
- [React Router](https://reactrouter.com/)