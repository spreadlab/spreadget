const Spreadparser = require('spreadparser');
const axios = require('axios').default;
const fs = require('fs');
const matter = require('gray-matter');
const postsAdapter = require('./adapters/posts');

const getPostsFromSpreadsheet = (spreadsheetId, sheetNumber) => {
    return axios.get(Spreadparser.getSpreadsheetUrl(spreadsheetId, sheetNumber))
        .then(response => response.data)
        .then(data => Spreadparser.parse(data).data)
        .catch(error => console.log(error));
};

const readFile = file => new Promise((resolve, reject) => {
    fs.readFile(file, (err, contents) => {
        err ? reject(err) : resolve(contents);
    })
});

const writeFile = (fileName, contents) => new Promise((resolve, reject) => {
    fs.writeFile(fileName, contents, (err) => {
        err ? reject(err) : resolve(contents);
    })
});

const getPostsFromJSON = (outputDir) => {
    const JSONPath = `${outputDir}/data.json`;

    return new Promise((resolve) => {
        readFile(JSONPath)
            .then(contents => resolve(JSON.parse(contents)))
            .catch(() => {
                writeFile(JSONPath, '[]')
                    .then(() => resolve([]))
            })
    });
};

const filterPostsToUpdate = (originalPosts, newPosts, shouldForceUpdate) => {
    return shouldForceUpdate ? newPosts : newPosts.filter(newPost => {
        const previousPost = originalPosts.find(currentPost => currentPost.slug === newPost.slug) || null;
        const isNewPost = previousPost === null;
        const isUpdated = isNewPost ? true : previousPost.version < newPost.version;
        return isNewPost || isUpdated;
    });
};

const writePostsToFiles = async (originalPosts, postsToUpdate, outputDir) => {
    const JSONPath = `${outputDir}/data.json`;

    await postsToUpdate.forEach(async post => {
        const {data, content} = await postsAdapter(post);
        const fileName = `${outputDir}/${post.slug}.md`;
        await writeFile(fileName, matter.stringify(content.content, JSON.parse(JSON.stringify(data))));
        await writeFile(JSONPath, JSON.stringify(Object.assign(originalPosts, postsToUpdate), null, 2));
    });
};

async function update(spreadsheetId, options = {}) {
    fs.mkdir(options.outputDir, { recursive: true }, (err) => {
        if (err) throw err;
    });
    const postsFromSpreadsheet = await getPostsFromSpreadsheet(spreadsheetId, options.sheetNumber);
    const postsFromJSON = await getPostsFromJSON(options.outputDir);
    const postsToUpdate = filterPostsToUpdate(postsFromJSON, postsFromSpreadsheet, options.shouldForceUpdate );
    await writePostsToFiles(postsFromJSON, postsToUpdate, options.outputDir);
    return `${postsToUpdate.length} posts updated.`;
}

module.exports = update;
