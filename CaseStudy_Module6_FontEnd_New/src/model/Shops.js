export class Shops{
    id
    name
    phone
    description
    email
    startTime
    endTime
    statusShops
    user
    city

    constructor(id, name, phone, description, email, startTime, endTime, statusShops, user, city) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.description = description;
        this.email = email;
        this.startTime = startTime;
        this.endTime = endTime;
        this.statusShops = statusShops;
        this.user = user;
        this.city = city;
    }
}