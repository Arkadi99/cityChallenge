import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize";
import md5 from "md5";
import Users from "./Users";


const {PASSWORD_SECRET} = process.env

class Company extends Model {
    static passHash = (password) => {
        return md5(md5(password) + PASSWORD_SECRET)
    }
}

Company.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "companyName"
    },
    status: {
        type: DataTypes.ENUM('active', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
    },
    role: {
        type: DataTypes.ENUM('vipCompany', 'company'),
        allowNull: false,
        defaultValue: 'company',
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'email'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return undefined
        },
        set(val) {
            if (val) {
                this.setDataValue('password', Company.passHash(val))
            }
        }
    },
    number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true,
            len: [6, 15],
        },
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    industry: {
        type: DataTypes.ENUM('caffe', 'bar', 'pub', 'club','shop', 'restaurant','other'), // shatacnel???/
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue:0,
        validate: {
            min: 1,
            max: 5
        },
    },
    ratingNum: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0
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
    tableName: "company",
    modelName: "company",
    indexes: [{
        fields: ['email'],
        unique: true
    }]
})



export default Company
