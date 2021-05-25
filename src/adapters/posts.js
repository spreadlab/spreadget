const postToFrontmatterData = (post, markdown) => {
    return {
        category: post.category,
        description: post.description,
        document: post.document,
        image: post.image && post.image.src ? {
            src: post.image.src
        } : undefined,
        published: post.published,
        slug: post.slug,
        tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : undefined,
        title: post.title || markdown.title,
        version: post.version
    };
};

module.exports = postToFrontmatterData;
