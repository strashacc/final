class User {
    constructor(user) {
        if (user.Password)
            this.Password = user.Password;
        if (user.Name)
            this.Name = user.Name;
        if (user.Username)
            this.Username = user.Username;
        if (user.Email)
            this.Email = user.Email;
        if (user.Bio)
            this.Bio = user.Bio;
        if (user.isAdmin)
            this.isAdmin = user.isAdmin;
    }
}

module.exports = {User};