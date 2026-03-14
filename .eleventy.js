module.exports = function(eleventyConfig) {
  // Pass through all static assets untouched
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("privacy.html");
  eleventyConfig.addPassthroughCopy("terms.html");

  // Ignore non-template files
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("_site/**");
  eleventyConfig.ignores.add("privacy.html");
  eleventyConfig.ignores.add("terms.html");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    },
    htmlTemplateEngine: "liquid"
  };
};