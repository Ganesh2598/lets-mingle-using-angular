const Sequelize = require("sequelize");
require("dotenv").config();

const connection = new Sequelize(`mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost/${process.env.DB_DATABASE}`);

const db = {}

db.Sequelize = Sequelize;
db.connection = connection;
db.user = require("./models/user")(Sequelize, connection)
db.post = require("./models/post")(Sequelize, connection)
db.friends = require("./models/friends")(Sequelize, connection)
db.comments = require("./models/comments")(Sequelize, connection)
db.childcomments = require("./models/childComments")(Sequelize, connection)

db.user.hasMany(db.post,{
    foreignKey : "fk_userid",
    sourceKey : "userid"
})
db.post.belongsTo(db.user, {
    foreignKey : "fk_userid",
})

db.user.hasMany(db.friends, {
    foreignKey : "fk_userid",
    sourceKey : "userid"
})
db.friends.belongsTo(db.user, {
    foreignKey : "fk_userid"
})

db.post.hasMany(db.comments,{
    foreignKey : "fk_postid",
    sourceKey : "id"
})
db.comments.belongsTo(db.post,{
    foreignKey : "fk_postid"
})

db.comments.hasMany(db.childcomments,{
    foreignKey : "fk_commentid",
    sourceKey : "id"
})
db.childcomments.belongsTo(db.comments,{
    foreignKey : "fk_commentid"
})


module.exports = db;