import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize";

class Language extends Model {

}

Language.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.ENUM('am', 'ru', 'en'),
        allowNull: false,
        defaultValue: 'am',
    },
}, {
    sequelize,
    tableName: "language",
    modelName: "language",
});

// Establish the association between Users and VisaCards


export default Language
