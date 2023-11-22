import request from "supertest";
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {chatApi} from "../chatApi";


dotenv.config({ path: "../.env" });

const app = express();
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.MONGODB_URL);
beforeAll(async () => {
    await mongoClient.connect();
    const database = mongoClient.db("test_database");
    await database.collection("messages").deleteMany({});
    app.use(chatApi(database));
});
afterAll(() => {
    mongoClient.close();
});

describe("chat api", () => {
    it("adds a new message", async () => {
        const chatMessage = "text for testing";
        const roomName = "cool testing room";
        const user = "cool testing user";

        await request(app)
            .post("/api/chat")
            .send({chatMessage, roomName, user }).set('Accept', 'application/json')
            .expect(200)
        console.log(await request(app).get("/api/chat?roomName="+roomName).expect(200).body)
    });
});