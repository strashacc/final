var index = 0;

window.onload = () => {
    getPosts();
}

async function getPosts() {
    const posts = await fetch(`/posts/getPosts?skip=${index}`, {method: 'GET'}).then(async (res) => {return (await res.text())});
    if (posts)
        index += 20;
    const postsSection = document.getElementById('posts');
    if (!postsSection)
        postsSection = document.body;
    postsSection.innerHTML = postsSection.innerHTML + posts;
    const moreBtn = document.createElement('button');
    moreBtn.textContent = 'More';
    moreBtn.onclick = () => {
        postsSection.removeChild(moreBtn);
        getPosts();
    };
    postsSection.appendChild(moreBtn);
}