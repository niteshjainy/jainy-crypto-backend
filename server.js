const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const FILE = "./data.json";

// ===== LOAD FILE =====
function loadData() {
    try {
        if (fs.existsSync(FILE)) {
            return JSON.parse(fs.readFileSync(FILE));
        }
    } catch (e) { }
    return { systems: null, version: 0 };
}

// ===== SAVE FILE =====
function saveData(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

let globalState = loadData();

// ===== GET =====
app.get("/get-state", (req, res) => {
    res.json(globalState);
});

// ===== SAVE =====
app.post("/save-state", (req, res) => {
    const { systems, version } = req.body;

    if (version < globalState.version) {
        return res.json({
            success: false,
            message: "Outdated",
            latest: globalState,
        });
    }

    globalState = { systems, version };

    saveData(globalState);

    res.json({ success: true });
});

// ===== PROXY =====
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
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});