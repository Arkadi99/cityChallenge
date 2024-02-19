import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize";
import Users from "./Users";
import Company from "./Company";
import Language from "./Language";

class Translation extends Model {

}

Translation.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    languageCode: {
        type: DataTypes.ENUM('am', 'ru', 'en'),
        allowNull: false,
        defaultValue: 'am',
    },
    challengeDescription: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companyDescription: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    sequelize,
    tableName: "translation",
    modelName: "translation",
});

Translation.belongsTo(Language, {
    foreignKey: 'languageId',
    onDelete: 'cascade',
    onUpdate: 'cascade',

});
Language.hasMany(Translation, {
    foreignKey: 'languageId',
    onDelete: 'cascade',
    onUpdate: 'cascade'
});


export default Translation
