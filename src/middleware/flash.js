/**
 * Flash Message Middleware
 *
 * Provides temporary message storage that survives redirects but is consumed on render.
 * Messages are stored in the session and organized by type: success, error, warning, info.
 */

const flashMiddleware = (req, res, next) => {
    req.flash = function(type, message) {
        // Initialize flash storage if it does not exist
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // SET message
        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);
            return;
        }

        // GET messages for one type
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // GET all messages
        const allMessages = req.session.flash || {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        // Clear all messages after retrieving
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
};

const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next();
};

const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;