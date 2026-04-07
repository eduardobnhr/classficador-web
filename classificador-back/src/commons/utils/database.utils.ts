import { ObjectLiteral, Repository } from 'typeorm';

export class DatabaseUtils {
    static async getDateNowInDB<T extends ObjectLiteral>(repository: Repository<T>): Promise<Date> {
        const [dateNow] = await repository.query(`SELECT NOW() as date_now`);
        return dateNow.date_now;
    }
}
