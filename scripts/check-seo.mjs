import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const [html, robots, sitemap, manifest] = await Promise.all([
  readFile(path.join(out, "index.html"), "utf8"),
  readFile(path.join(out, "robots.txt"), "utf8"),
  readFile(path.join(out, "sitemap.xml"), "utf8"),
  readFile(path.join(out, "manifest.webmanifest"), "utf8"),
]);

const failures = [];
const requireText = (source, text, label) => {
  if (!source.includes(text)) failures.push(`Missing ${label}`);
};

requireText(html, '<html lang="en-IN"', "document language");
requireText(html, "<title>Bonaca — A Private Retreat</title>", "page title");
requireText(html, '<meta name="description"', "meta description");
requireText(html, '<link rel="canonical"', "canonical URL");
requireText(html, 'property="og:image"', "Open Graph image");
requireText(html, 'name="twitter:card"', "X/Twitter card");
requireText(html, 'type="application/ld+json"', "JSON-LD");
requireText(html, 'rel="manifest"', "web manifest link");
requireText(html, '<main id="main-content">', "main landmark target");

if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
  failures.push("The home page must contain exactly one h1");
}

const jsonLdMatch = html.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
);
if (jsonLdMatch) {
  try {
    JSON.parse(jsonLdMatch[1]);
  } catch {
    failures.push("JSON-LD is not valid JSON");
  }
}

try {
  JSON.parse(manifest);
} catch {
  failures.push("Web manifest is not valid JSON");
}

const containsPlaceholders =
  /hello@bonaca\.example|\+91 00000 00000|Location to be confirmed|placeholder quote/.test(
    html,
  );
const blocksIndexing = /<meta name="robots" content="[^"]*noindex/.test(html);

if (containsPlaceholders && !blocksIndexing) {
  failures.push("Placeholder content is present but indexing is not blocked");
}
if (!containsPlaceholders && blocksIndexing) {
  failures.push("Real content is present but indexing is still blocked");
}
if (!robots.includes("User-Agent: *")) failures.push("robots.txt has no global rule");
if (!sitemap.includes("<urlset")) failures.push("sitemap.xml is invalid");

await Promise.all([
  access(path.join(out, "favicon.ico")),
  access(path.join(out, "social", "og-image.png")),
]);

if (failures.length > 0) {
  console.error(`SEO check failed:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else if (blocksIndexing) {
  console.log("SEO check passed (preview mode: placeholder content is noindex). ");
} else {
  console.log("SEO check passed (launch mode: indexing and sitemap enabled). ");
}
