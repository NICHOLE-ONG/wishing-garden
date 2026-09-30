# 🌙 Wishing Garden

A community wishing garden. Draw a flower, write a wish, and plant it in a shared moonlit garden where everyone else's flowers are growing too. Wander through the garden, read other people's wishes, and water their flowers as a little act of hope.

## ✨ Features

- **Draw your own flower**: sketch freehand on a canvas with a colour picker and eraser. Strokes are saved as vector points, so every flower renders with a soft glow in the garden.
- **Make a wish**: attach a message (and an optional name, or stay anonymous) to your flower.
- **Plant it in the shared garden**: your flower is placed in the garden and appears for everyone.
- **Read other people's wishes**: click any flower to open a popup with its wish and author.
- **Water flowers**: give someone else's wish a bit of hope. Each flower keeps a water count.

## 🛠 Tech Stack

| Layer | Tools |
| --- | --- |
| Server | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Views | EJS |
| Frontend | Vanilla JavaScript, HTML5 Canvas (Pointer Events for drawing) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- A MongoDB database (local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Installation

```bash
git clone https://github.com/<your-username>/wishing-garden.git
cd wishing-garden
npm install
```

### Configuration

Create a `config.env` file in the project root (it is gitignored, so your credentials stay private):

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
PORT=8000
```

`PORT` is optional and defaults to `8000`.

### Run

```bash
node server.js
# or, with auto-reload during development
npx nodemon server.js
```

Then open [http://localhost:8000](http://localhost:8000).

## 📁 Project Structure

```
├── server.js                 # Express app, DB connection, route mounting
├── models/wish.js            # Mongoose schema
├── controllers/
│   ├── wishController.js     # Create, list, and water wishes
│   └── pageController.js     # Renders the garden page
├── routes/
│   ├── wishRoutes.js         # /api/wishes endpoints
│   └── pageRoutes.js         # Page routes
├── utils/position.js         # Random flower placement
├── views/garden.ejs          # Garden page, drawing modal, wish popup
├── public/garden.js          # Canvas drawing + garden rendering + click handling
└── client/interactions.js    # Watering helper
```
