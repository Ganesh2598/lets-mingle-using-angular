module.exports = (Sequelize, connection)=> {
    const Childcomments = connection.define("Childcomments",{
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
        tableName : "Childcomments"
    })


    return Childcomments;
}