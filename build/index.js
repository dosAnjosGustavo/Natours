"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err);
    process.exit(1);
});
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const app_1 = __importDefault(require("./app"));
// Connect to DB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then((con) => console.log('DB connection successful!'));
// Start Server
const port = process.env.PORT || 3000;
const server = app_1.default.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err);
    server.close(() => {
        process.exit(1); // 0 = success, 1 = uncaught exception
    });
});
//# sourceMappingURL=index.js.map