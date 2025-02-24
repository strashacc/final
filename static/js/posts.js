let skip = document.getElementById('posts')?.children.length || 0;

window.onload = () => {
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.onclick = getPosts;
    }
}

async function getPosts() {
    try {
        const response = await fetch(`/posts/getPosts?skip=${skip}`);
        const postsHtml = await response.text();
        
        if (postsHtml.trim().length > 0) {
            const postsSection = document.getElementById('posts');
            postsSection.innerHTML += postsHtml;
            skip += 20;
        } else {
            document.getElementById('loadMore').style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}