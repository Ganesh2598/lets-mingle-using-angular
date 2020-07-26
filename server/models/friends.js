module.exports = (Sequelize, connection)=> {
    const Friends = connection.define("Friends",{
        name : {
            type : Sequelize.STRING
        },
        imageUrl : {
            type : Sequelize.STRING
        },
        userid : {
            type : Sequelize.INTEGER
        }
    },{
        tableName : "Friends"
    })

    return Friends;
}