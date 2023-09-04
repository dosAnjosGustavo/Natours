"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const viewRoutes_1 = __importDefault(require("./routes/viewRoutes"));
const variables_1 = require("./routes/variables");
const app = (0, express_1.default)();
app.set('view engine', 'pug');
app.set('views', path_1.default.join(__dirname, 'views'));
// Global Middlewares
// Set Security HTTP headers
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", 'https://*.mapbox.com', 'https://*.stripe.com'],
        baseUri: ["'self'"],
        // fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
            "'self'",
            'https://*.stripe.com',
            'https://cdnjs.cloudflare.com',
            'https://api.mapbox.com',
            'https://js.stripe.com',
            'blob:',
        ],
        frameSrc: ["'self'", 'https://*.stripe.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    },
}));
// Development logging
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
// Limit requests from same IP
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP. Please try again in an hour!',
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
// Prevent parameter pollution
app.use((0, hpp_1.default)({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
    ],
}));
app.use((0, compression_1.default)());
// Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Routes
app.use('/', viewRoutes_1.default);
app.use(variables_1.ROOT + variables_1.TOURS, tourRoutes_1.default);
app.use(variables_1.ROOT + variables_1.USERS, userRoutes_1.default);
app.use(variables_1.ROOT + variables_1.REVIEWS, reviewRoutes_1.default);
app.use(variables_1.ROOT + variables_1.BOOKINGS, bookingRoutes_1.default);
app.all('*', (req, _res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map