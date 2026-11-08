process.env.DATABASE_URL = "postgresql://orenys:orenys@localhost:5433/orenys_test?schema=public";
process.env.ACCESS_TOKEN_SECRET = "test-secret-should-be-at-least-32-characters";
process.env.COOKIE_SECURE = "false";
process.env.ACCESS_TOKEN_TTL_SECONDS = "900";
process.env.REFRESH_TOKEN_TTL_DAYS = "30";
process.env.PORT = "3000";
process.env.WEB_ORIGIN = "http://localhost:5173";
delete process.env.WEB_DIST_DIR;
