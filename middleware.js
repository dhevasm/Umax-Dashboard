import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en', 'id', 'jp', 'ar', 'jv'],
    defaultLocale: 'en',
})

export const config = {
    matcher: ['/', '/(id|en|jp|ar|jv)/:path*']
}