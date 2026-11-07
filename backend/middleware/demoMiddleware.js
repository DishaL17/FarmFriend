export default function demoMiddleware(req, res, next) {
if (req.isDemo) {
return res.status(403).json({
success: false,
message: "This action is disabled in demo mode. You can explore the existing sample data."
});
}

next();
}
