class Post {
    constructor(Post) {
        if (Post._id)
            this._id = Post._id;
        if (Post.Title)
            this.Title = Post.Title;
        if (Post.Description)
            this.Description = Post.Description;
        if (Post.Content)
            this.Content = Post.Content;
        else
            this.Content = {};
        if (Post.Author)
            this.Author = Post.Author;
        if (Post.Created)
            this.Created = Post.Created;
        if (Post.Updated)
            this.Updated = Post.Updated;
        
        for (let item in Post) {
            if (item.startsWith('Content')) {
                console.log(item);
                const key = item.substring(item.indexOf('.') + 1, item.length);
                this.Content[key] = Post[item];
            }
        }
    }
}

module.exports = {Post}