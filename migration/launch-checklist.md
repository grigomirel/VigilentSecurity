# Domain migration launch checklist

## Before DNS cutover

- Upload the new site to the `vigilent-security.ro` hosting account with `.htaccess` enabled.
- Verify that `/` returns `200`, while `/acasa.html` returns a single `301` to `/`.
- Verify every URL in `sitemap.xml` returns `200` and has a self-referencing canonical.
- Install `legacy-vigilentsecuritytehnic.htaccess` on the old domain's hosting account.
- Keep valid TLS certificates for both `www` and non-`www` versions of both domains.

## After DNS cutover

- Test redirects over HTTP and HTTPS, with and without `www`.
- Add all domain variants to Google Search Console.
- Submit `https://vigilent-security.ro/sitemap.xml`.
- Use Search Console Change of Address for `vigilentsecuritytehnic.ro` to `vigilent-security.ro`.
- Do not use Change of Address for `vigilent-security.ro`; it remains the primary domain.
- Monitor indexing, 404s, 5xx errors and redirect chains weekly during the first month.
- Keep the old domain and its redirects online for at least one year, preferably indefinitely.

## Pending business confirmation

Decide whether the training service is still offered. Create equivalent modern content before redirecting its legacy page. If permanently discontinued, return `410 Gone` instead of redirecting it to an unrelated page.
