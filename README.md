# Sphynx-Flicks 🎬

A modern movie discovery web app. Built with **React** ⚛️, **Node.js** 🟢, and **MySQL** 🐬.

Hosted Live: [https://sphynx-flicks.pages.dev/](https://sphynx-flicks.pages.dev/)

## Features

- Discover trending and popular movies
- Search movies and get real-time results
- Browse by genre and ratings
- View detailed movie information (cast, synopsis, etc.)
- Responsive and clean UI
- User authentication and profiles (if enabled)
- Manage personal watchlists and favorites

## Tech Stack

- **Frontend:** React, CSS, HTML
- **Backend:** Node.js, Express
- **Database:** MySQL
- **APIs:** Integration with The Movie Database (TMDb) or similar APIs

## Getting Started

### Prerequisites

- Node.js & npm
- MySQL

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/perera99-msd/Sphynx-Flicks.git
    cd Sphynx-Flicks
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```
    _Navigate to the frontend and backend folders if applicable, and install their dependencies as well._

3. **Set up environment variables**
    - Create `.env` files for your backend and frontend as needed. You may need:
      - Database credentials
      - TMDb API key

4. **Set up the Database**
    - Create a MySQL database.
    - Run any migration scripts or import the provided SQL schema.

5. **Run the Application**
    ```bash
    npm start
    ```
    _Or separately for frontend and backend:_
    ```bash
    cd client
    npm start
    cd ../server
    npm start
    ```

6. **Access the app**
    - Visit `http://localhost:3000` in your browser.

## Project Structure

```
/
├── client/     # React frontend
├── server/     # Node.js + Express backend
├── db/         # MySQL schema/scripts
├── public/
├── README.md
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

**Languages:**
- JavaScript (56.4%)
- CSS (43.3%)
- HTML (0.3%)

---

Built by [perera99-msd](https://github.com/perera99-msd)
