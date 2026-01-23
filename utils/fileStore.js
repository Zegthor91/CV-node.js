const fs = require('fs');
const path = require('path');

/**
 * Classe FileStore pour gérer le stockage de données dans des fichiers JSON
 * Permet de sauvegarder et récupérer des données de manière persistante
 */
class FileStore {
    /**
     * Constructeur
     * @param {string} dataDir - Répertoire où stocker les fichiers de données
     */
    constructor(dataDir = 'data') {
        this.dataDir = path.join(__dirname, '..', dataDir);
        this.ensureDataDir();
    }

    /**
     * S'assurer que le répertoire de données existe
     */
    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
            console.log(`Dossier de données créé: ${this.dataDir}`);
        }
    }

    /**
     * Obtenir le chemin complet d'un fichier
     * @param {string} filename - Nom du fichier (sans extension)
     * @returns {string} Chemin complet du fichier
     */
    getFilePath(filename) {
        return path.join(this.dataDir, `${filename}.json`);
    }

    /**
     * Lire les données d'un fichier JSON
     * @param {string} filename - Nom du fichier
     * @param {*} defaultValue - Valeur par défaut si le fichier n'existe pas
     * @returns {*} Données lues ou valeur par défaut
     */
    read(filename, defaultValue = []) {
        const filePath = this.getFilePath(filename);

        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(data);
            } else {
                // Si le fichier n'existe pas, créer avec la valeur par défaut
                this.write(filename, defaultValue);
                return defaultValue;
            }
        } catch (error) {
            console.error(`Erreur lors de la lecture de ${filename}:`, error.message);
            return defaultValue;
        }
    }

    /**
     * Écrire des données dans un fichier JSON
     * @param {string} filename - Nom du fichier
     * @param {*} data - Données à écrire
     * @returns {boolean} Succès de l'opération
     */
    write(filename, data) {
        const filePath = this.getFilePath(filename);

        try {
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(filePath, jsonData, 'utf-8');
            return true;
        } catch (error) {
            console.error(`Erreur lors de l'écriture de ${filename}:`, error.message);
            return false;
        }
    }

    /**
     * Ajouter un élément à une collection
     * @param {string} filename - Nom du fichier
     * @param {object} item - Élément à ajouter
     * @returns {object|null} Élément ajouté avec son ID ou null en cas d'erreur
     */
    add(filename, item) {
        try {
            const data = this.read(filename, []);

            // Générer un nouvel ID
            const newId = data.length > 0
                ? Math.max(...data.map(d => d.id)) + 1
                : 1;

            const newItem = { id: newId, ...item };
            data.push(newItem);

            this.write(filename, data);
            return newItem;
        } catch (error) {
            console.error(`Erreur lors de l'ajout dans ${filename}:`, error.message);
            return null;
        }
    }

    /**
     * Trouver un élément par ID
     * @param {string} filename - Nom du fichier
     * @param {number} id - ID de l'élément
     * @returns {object|null} Élément trouvé ou null
     */
    findById(filename, id) {
        const data = this.read(filename, []);
        return data.find(item => item.id === parseInt(id)) || null;
    }

    /**
     * Trouver tous les éléments
     * @param {string} filename - Nom du fichier
     * @returns {Array} Tableau de tous les éléments
     */
    findAll(filename) {
        return this.read(filename, []);
    }

    /**
     * Mettre à jour un élément
     * @param {string} filename - Nom du fichier
     * @param {number} id - ID de l'élément à mettre à jour
     * @param {object} updates - Données à mettre à jour
     * @returns {object|null} Élément mis à jour ou null
     */
    update(filename, id, updates) {
        try {
            const data = this.read(filename, []);
            const index = data.findIndex(item => item.id === parseInt(id));

            if (index === -1) {
                return null;
            }

            // Fusionner les mises à jour avec l'élément existant
            data[index] = { ...data[index], ...updates, id: parseInt(id) };

            this.write(filename, data);
            return data[index];
        } catch (error) {
            console.error(`Erreur lors de la mise à jour dans ${filename}:`, error.message);
            return null;
        }
    }

    /**
     * Supprimer un élément
     * @param {string} filename - Nom du fichier
     * @param {number} id - ID de l'élément à supprimer
     * @returns {object|null} Élément supprimé ou null
     */
    delete(filename, id) {
        try {
            const data = this.read(filename, []);
            const index = data.findIndex(item => item.id === parseInt(id));

            if (index === -1) {
                return null;
            }

            const deletedItem = data.splice(index, 1)[0];
            this.write(filename, data);
            return deletedItem;
        } catch (error) {
            console.error(`Erreur lors de la suppression dans ${filename}:`, error.message);
            return null;
        }
    }

    /**
     * Supprimer un fichier
     * @param {string} filename - Nom du fichier à supprimer
     * @returns {boolean} Succès de l'opération
     */
    deleteFile(filename) {
        const filePath = this.getFilePath(filename);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Fichier supprimé: ${filename}.json`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Erreur lors de la suppression du fichier ${filename}:`, error.message);
            return false;
        }
    }

    /**
     * Obtenir le nombre d'éléments dans une collection
     * @param {string} filename - Nom du fichier
     * @returns {number} Nombre d'éléments
     */
    count(filename) {
        const data = this.read(filename, []);
        return data.length;
    }

    /**
     * Vérifier si un fichier existe
     * @param {string} filename - Nom du fichier
     * @returns {boolean} True si le fichier existe
     */
    exists(filename) {
        const filePath = this.getFilePath(filename);
        return fs.existsSync(filePath);
    }

    /**
     * Réinitialiser un fichier avec des données par défaut
     * @param {string} filename - Nom du fichier
     * @param {*} defaultData - Données par défaut
     * @returns {boolean} Succès de l'opération
     */
    reset(filename, defaultData = []) {
        return this.write(filename, defaultData);
    }

    /**
     * Lister tous les fichiers dans le dossier de données
     * @returns {Array<string>} Liste des noms de fichiers
     */
    listFiles() {
        try {
            const files = fs.readdirSync(this.dataDir);
            return files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
        } catch (error) {
            console.error('Erreur lors de la liste des fichiers:', error.message);
            return [];
        }
    }

    /**
     * Rechercher des éléments selon un critère
     * @param {string} filename - Nom du fichier
     * @param {Function} predicate - Fonction de filtrage
     * @returns {Array} Éléments correspondant au critère
     */
    search(filename, predicate) {
        const data = this.read(filename, []);
        return data.filter(predicate);
    }
}

// Exporter une instance unique (Singleton)
const fileStore = new FileStore();

module.exports = fileStore;

