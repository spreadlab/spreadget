const TurndownService = require('turndown');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;
const axios = require('axios').default;

const docsToMarkdown = async (post) => {
    const removeGoogleAnchorStuff = (originalLink) => {
        const match = originalLink.match(/google.com\/url\?q=([^&]+)/) || null;
        return match ? match[1] : originalLink;
    };

    const anchorFilter = {
        filter: 'a',
        replacement: function (content, node) {
            return `<a href='${removeGoogleAnchorStuff(node.getAttribute('href'))}'>${content}</a>`;
        }
    };
    const turndown = new TurndownService({headingStyle: 'atx'});
    turndown
        .remove('style')
        .remove('script')
        .addRule('anchor', anchorFilter);

    return new Promise((resolve, reject) => {
        axios.get(post.document)
            .then(response => {
                const parser = new DOMParser();
                const html = parser.parseFromString(response.data, 'text/html');
                const content = html.querySelector('#contents').innerHTML;
                const title = html.querySelector('title').innerHTML;
                resolve({
                    title,
                    content: turndown.turndown(content)
                });
            }).catch(err => reject(err));
    })
};

module.exports = docsToMarkdown;
