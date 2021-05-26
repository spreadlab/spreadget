const categoriesAdapter = async (post) => {
    const content = {
        content: post.description
    };

    const data = {
        slug: post.slug,
        title: post.title,
        version: post.version
    };
    return {data, content};
};

module.exports = categoriesAdapter;
