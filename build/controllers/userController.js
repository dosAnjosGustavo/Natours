"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUser = exports.createUser = exports.deleteMe = exports.updateMe = exports.getMe = exports.resizeUserPhoto = exports.uploadUserPhoto = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const factory = __importStar(require("./handlerFactory"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image'))
        cb(null, true);
    else
        cb(new appError_1.default('Not an image! Please upload only images.', 400));
};
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.file)
        return next();
    req.file.filename = `user-${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}-${Date.now()}.jpeg`;
    yield (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
}));
// Route Handlers
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
const getMe = (req, _res, next) => {
    var _a;
    req.params.id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    next();
};
exports.getMe = getMe;
exports.updateMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm)
        return next(new appError_1.default('This route is not for password updates. Please use /updateMyPassword.', 400));
    // 2) Filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file)
        filteredBody.photo = req.file.filename;
    // 3) Update user document
    const updatedUser = yield userModel_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: { user: updatedUser },
    });
}));
// User deleting himself
exports.deleteMe = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    yield userModel_1.default.findByIdAndUpdate((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
}));
// Create User
const createUser = (_req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead.',
    });
};
exports.createUser = createUser;
exports.getUser = factory.getOne(userModel_1.default);
exports.getAllUsers = factory.getAll(userModel_1.default);
// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(userModel_1.default);
exports.deleteUser = factory.deleteOne(userModel_1.default);
//# sourceMappingURL=userController.js.map