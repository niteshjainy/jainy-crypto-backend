const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3001;

// TEST
app.get("/", (req, res) => {
    res.send("Backend running 🚀");
});

// ✅ PROXY (WORKING IN EXPRESS 4)
app.get("/api/*", async (req, res) => {
    try {
        const path = req.params[0];

        const url = `https://open-api-v4.coinglass.com/api/${path}`;

        const response = await axios.get(url, {
            params: req.query,
            headers: {
                "CG-API-KEY": "310c7712922b46978f2bcb0919b9f7c8",
            },
        });

        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: err.response?.data || err.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});