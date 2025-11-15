/**
 * Firestore Utilities
 * Helper functions para operaciones comunes de Firestore
 */

const admin = require('firebase-admin');

/**
 * Obtener documento de Firestore
 */
async function getDocument(collection, docId) {
    try {
        const doc = await admin.firestore()
            .collection(collection)
            .doc(docId)
            .get();

        if (!doc.exists) {
            return null;
        }

        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error(`Error getting document ${collection}/${docId}:`, error);
        throw error;
    }
}

/**
 * Crear o actualizar documento
 */
async function setDocument(collection, docId, data, merge = true) {
    try {
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        const dataWithTimestamp = {
            ...data,
            updatedAt: timestamp,
        };

        if (!merge) {
            dataWithTimestamp.createdAt = timestamp;
        }

        await admin.firestore()
            .collection(collection)
            .doc(docId)
            .set(dataWithTimestamp, { merge });

        return dataWithTimestamp;
    } catch (error) {
        console.error(`Error setting document ${collection}/${docId}:`, error);
        throw error;
    }
}

/**
 * Crear documento con ID auto-generado
 */
async function addDocument(collection, data) {
    try {
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        const dataWithTimestamp = {
            ...data,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const docRef = await admin.firestore()
            .collection(collection)
            .add(dataWithTimestamp);

        return docRef.id;
    } catch (error) {
        console.error(`Error adding document to ${collection}:`, error);
        throw error;
    }
}

/**
 * Query documentos con filtros
 */
async function queryDocuments(collection, filters = [], limit = 100) {
    try {
        let query = admin.firestore().collection(collection);

        filters.forEach(([field, operator, value]) => {
            query = query.where(field, operator, value);
        });

        query = query.limit(limit);

        const snapshot = await query.get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error(`Error querying ${collection}:`, error);
        throw error;
    }
}

module.exports = {
    getDocument,
    setDocument,
    addDocument,
    queryDocuments,
};