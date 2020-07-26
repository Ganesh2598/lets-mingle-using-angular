module.exports = (Sequelize, connection)=> {
    const Comments = connection.define("Comments",{
        comment : {
            type : Sequelize.STRING
        },
        username : {
            type : Sequelize.STRING
        },
        userid : {
            type : Sequelize.INTEGER
        }
    },{
        tableName : "Comments"
    })


    return Comments;
}