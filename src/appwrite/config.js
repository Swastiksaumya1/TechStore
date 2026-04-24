import conf from '../conf/conf.js';
import { Client, ID, Databases, Query } from 'appwrite';
 
export class Service { 
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteEndpoint)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    // Create a new order
    async createOrder({ item, total, date, userId, status = "active" }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    item: JSON.stringify(item), // Match user's column name
                    total: String(total),
                    date,
                    userId,
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createOrder :: error", error);
            throw error;
        }
    }

    // Update an existing order status
    async updateOrder(orderId, { status }) { 
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                orderId,
                {
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateOrder :: error", error);
            throw error;
        }
    }

    // Delete an order
    async deleteOrder(orderId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                orderId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteOrder :: error", error);
            return false;
        }
    }

    // Get a specific order by ID
    async getOrder(orderId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                orderId
            );
        } catch (error) {
            console.log("Appwrite service :: getOrder :: error", error);
            throw error;
        }
    }

    // Get all orders for a specific user
    async getUserOrders(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('date')
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getUserOrders :: error", error);
            return false;
        }
    }

    // Admin: Get all orders globally
    async getAllOrders() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.orderDesc('date')
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getAllOrders :: error", error);
            return false;
        }
    }
}

const service = new Service();
export default service;