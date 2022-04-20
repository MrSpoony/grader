const config = {
    cookieName: "graderSession",
    password: "gradersreallycomplicatedPassswordQRuF.Gp8,nr>{BjB4UJ}",
    cookieOptions: {
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600
    }
};

export default config;
