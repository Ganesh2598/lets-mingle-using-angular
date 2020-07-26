module.exports = (Sequelize, connection)=> {
    const Post = connection.define("Post",{
        caption : {
            type : Sequelize.STRING
        },
        imageUrl : {
            type : Sequelize.STRING
        },
        userName : {
            type : Sequelize.STRING
        },
        status: {
            type : Sequelize.STRING
        }
    },{
        tableName : "Post"
    })


    return Post;
}