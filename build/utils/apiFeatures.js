"use strict";
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
const tourModel_1 = __importDefault(require("../models/tourModel"));
// Build query
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.query = query;
        this.queryString = queryString;
    }
    // 1A) Filtering
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excluideFields = ['page', 'sort', 'limit', 'fields'];
        excluideFields.forEach((el) => delete queryObj[el]);
        // 1B) Advanced Filtering
        const queryStr = JSON.stringify(queryObj);
        const queryStrMod = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, // b=word boundary(exactly that words), g=global(all matches), e=expression
        (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStrMod));
        return this;
    }
    // 2) Sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query.sort(sortBy);
        }
        else {
            this.query.sort('-createdAt');
        }
        return this;
    }
    // 3) Field Limiting
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        }
        else {
            this.query.select('-__v'); // exclude __v field
        }
        return this;
    }
    // 4) Pagination
    paginate() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = +this.queryString.page || 1;
            const limit = +this.queryString.limit || 100;
            const skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit);
            if (this.queryString.page) {
                const numTours = yield tourModel_1.default.countDocuments();
                if (skip >= numTours)
                    throw new Error('This page does not exist');
            }
            return this;
        });
    }
}
exports.default = APIFeatures;
//# sourceMappingURL=apiFeatures.js.map