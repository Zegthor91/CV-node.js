const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuration des dossiers statiques (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route principale pour afficher le CV
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route API pour obtenir les données du CV en JSON (optionnel)
app.get('/api/cv', (req, res) => {
    const cvData = {
        nom: "Idir ZEGTITOUCHE",
        titre: "Développeur web et d'applications",
        localisation: "Vitry sur Seine, France",
        email: "idirzegtitouche@efrei.net",
        profil: "Étudiant en école d'ingénieur passionné par le développement web et d'applications. Compétences en développement front-end et back-end, avec une forte appétence pour les nouvelles technologies.",
        experiences: [
            {
                poste: "Développeur Node.js — Entreprise A",
                periode: "2024 - 2026"
            },
            {
                poste: "Data / Gestion de projet — Entreprise B",
                periode: "2022 - 2024"
            }
        ],
        formation: [
            {
                etablissement: "École d'ingénieur — EFREI",
                localisation: "Villejuif",
                periode: "En cours",
                option: "Option: développement web Projet: API + interface"
            },
            {
                etablissement: "Lycée — Adolphe Chérioux",
                localisation: "Vitry sur Seine"
            }
        ],
        loisirs: [
            "Football",
            "Musculation",
            "Cosplay"
        ]
    };
    res.json(cvData);
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`\nServeur CV démarré !`);
    console.log(`Votre CV est accessible sur : http://localhost:${PORT}`);
    console.log(`API CV disponible sur : http://localhost:${PORT}/api/cv\n`);
});
