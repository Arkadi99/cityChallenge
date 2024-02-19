import {Users, Company, Challenge,VisaCard} from "../models";

(async function main() {
    for (const Model of [
        Users,
        Company,
        Challenge,
        VisaCard
    ]){
        await Model.sync({ alter: true, logging: false });
    }
    console.log('done');
    process.exit();
})()
