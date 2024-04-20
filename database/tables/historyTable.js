// Database Queries
import historyQueries from '#database/queries/historyQueries.js';

// Database Managers
import TableManager from '#database/tableManager.js';

const validateRules = {
    type: ['required', 'actionType'],
};

class HistoryTableManager extends TableManager {
    constructor() {
        super('history', historyQueries, validateRules);
    }
}

export default new HistoryTableManager();
