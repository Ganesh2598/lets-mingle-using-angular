
module.exports = (Sequelize, connection)=> {
    const User = connection.define("User",{
        userid : {
            type : Sequelize.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        name : {
            type : Sequelize.STRING
        },
        email : {
            type : Sequelize.STRING
        },
        hashedEmail : {
            type : Sequelize.STRING
        },
        imageUrl : {
            type : Sequelize.STRING
        },
        password : {
            type : Sequelize.STRING
        },
        isverified : {
            type : Sequelize.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        resetToken : {
            type : Sequelize.STRING
        }
    },{
        tableName : "User"
    })

    /*User.associate = models =>{
        User.hasMany(models.Post,{
            onDelete : "cascade"
        })
    }*/

    return User;
}