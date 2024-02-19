import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize";
import Users from "./Users";
import Company from "./Company";



class Challenge extends Model {

}

Challenge.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    challengeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ownerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('company', 'users', 'admin'),
        allowNull: false,
    },
    challengeCity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    challengeAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    challengePrice: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    industry: {
        type: DataTypes.ENUM('online', 'offline', 'group', 'individual', 'indefinite', 'funny', 'intellectual', 'paid', 'free','other',),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue:0,
        validate: {
            min: 0,
            max: 5
        },
    },
    ratingNum: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0
    },
    userNum: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0
    },

}, {
    sequelize,
    tableName: "challenge",
    modelName: "challenge",
    indexes: [{
        fields: ['challengeName'],
        unique: true
    }]
})
Challenge.belongsTo(Company, {
    foreignKey: 'companyId',
    onDelete: 'cascade',
    onUpdate: 'cascade'
});

Company.hasMany(Challenge, {
    foreignKey: 'companyId',
    onDelete: 'cascade',
    onUpdate: 'cascade'
});
Challenge.belongsTo(Users, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade'
});
Users.hasMany(Challenge, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    onUpdate: 'cascade'
});

// Challenge.belongsTo(Translation, {
//     foreignKey: 'companyId',
//     onDelete: 'cascade'
// });
// Translation.hasMany(Challenge, {
//     foreignKey: 'companyId',
//     onDelete: 'cascade'
// });


export default Challenge
