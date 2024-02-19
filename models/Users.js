import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize";
import md5 from "md5";

const {PASSWORD_SECRET} = process.env

class Users extends Model {
    static passHash = (password) => {
        return md5(md5(password) + PASSWORD_SECRET)
    }
}

Users.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: true,
        unique:'nickname'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true,
            len: [6, 15],
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return undefined
        },
        set(val) {
            if (val) {
                this.setDataValue('password', Users.passHash(val))
            }
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
    },
    role: {
        type: DataTypes.ENUM('vipTourist','tourist','admin'),
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('male','female','none'),
        allowNull: true,
        defaultValue: 'none',
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    activationCode: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            return undefined
        }
    },
    allFields: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false
    }

}, {
    sequelize,
    tableName: "users",
    modelName: "users",
    indexes: [{
        fields: ['email'],
        unique: true
    }]
})



export default Users
