export class User{
    id;
    username;
    password;
    email;
    phone;
    birthday;
    gender;
    image;
    statusUser;
    roles;
    city;

    constructor(id, username, password, email, phone, birthday, gender, image, statusUser, roles, city ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.birthday = birthday;
        this.gender = gender;
        this.image = image;
        this.statusUser = statusUser;
        this.roles = roles;
        this.city = city;
    }
}