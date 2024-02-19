import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize";
import md5 from "md5";
import Company from "./Company";
import Users from "./Users";
import Challenge from "./Challenge";

const {PASSWORD_SECRET} = process.env

class VisaCard extends Model {
    static cardHash = (hash) => {
        return md5(md5(hash) + PASSWORD_SECRET)
    }
}

VisaCard.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    cardholderName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cardNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return undefined
        },
        set(val) {
            if (val) {
                this.setDataValue('cardNumber', VisaCard.cardHash(val))
            }
        }
    },
    expirationMonth: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false
    },
    expirationYear: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    },
    cvv: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return undefined
        },
        set(val) {
            if (val) {
                this.setDataValue('cvv', VisaCard.cardHash(val))
            }
        }
    },
},{
    sequelize,
    tableName: "visaCard",
    modelName: "visaCard",
    indexes: [{
        fields: ['cardNumber'],
        unique: true
    }]
});



VisaCard.belongsTo(Company, {
    foreignKey: 'companyId',
    onDelete: 'cascade'
});

Company.hasMany(VisaCard, {
    foreignKey: 'companyId',
    onDelete: 'cascade'
});
VisaCard.belongsTo(Users, {
    foreignKey: 'userId',
    onDelete: 'cascade'
});
Users.hasMany(VisaCard, {
    foreignKey: 'userId',
    onDelete: 'cascade'
});


export default VisaCard
