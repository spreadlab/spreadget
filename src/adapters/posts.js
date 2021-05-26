const docsToMarkdown = require("../utils/docsToMarkdown");

const postsAdapter = async (post) => {
    const markdown = await docsToMarkdown(post) || {};
    const data = {
        category: post.category,
        description: post.description,
        image: post.image && post.image.src ? {
            src: post.image.src
        } : undefined,
        published: post.published,
        slug: post.slug,
        tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : undefined,
        title: post.title || markdown.title,
        version: post.version
    };
    return {data, content: markdown.content };
};

module.exports = postsAdapter;
