const conf = {
    appwriteEndpoint: String(import.meta.env.VITE_APPWRITE_ENDPOINT).trim(),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID).trim(),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID).trim(),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID).trim(),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID).trim(),
}

console.log("Appwrite Config Debug:", conf);

export default conf;