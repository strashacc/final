window.onload = () => {
    const likesBtn = document.getElementById('likesBtn');
    const commentsBtn = document.getElementById('commentsBtn');
    commentsBtn.onclick = () => {document.getElementById('comments').scrollIntoView();}
    likesBtn.onclick = () => {
        toggleLike();
    }
}

async function toggleLike() {
    const likesBtn = document.getElementById('likesBtn');
    var status = await fetch(location.pathname + '/like', {method: 'get'}).then(res => {return res.text()});
    if (status == 'OK')
        likesBtn.classList.toggle('liked');
    if (likesBtn.classList.contains('liked'))
        likesBtn.innerText = likesBtn.innerText.substring(0, likesBtn.innerText.indexOf(' ') + 1) + 
                             (parseInt(likesBtn.innerText.substring(likesBtn.innerText.indexOf(' ') + 1, likesBtn.innerText.length)) + 1);
    else
        likesBtn.innerText = likesBtn.innerText.substring(0, likesBtn.innerText.indexOf(' ') + 1) + 
        (parseInt(likesBtn.innerText.substring(likesBtn.innerText.indexOf(' ') + 1, likesBtn.innerText.length)) - 1);
}