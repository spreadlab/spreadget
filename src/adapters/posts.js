const docsToMarkdown = require("../utils/docsToMarkdown");

const postToFrontmatterData = async (post) => {
    const content = await docsToMarkdown(post);
    const data = {
        category: post.category,
        description: post.description,
        document: post.document,
        image: post.image && post.image.src ? {
            src: post.image.src
        } : undefined,
        published: post.published,
        slug: post.slug,
        tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : undefined,
        title: post.title,
        version: post.version
    };
    return {data, content};
};

module.exports = postToFrontmatterData;
