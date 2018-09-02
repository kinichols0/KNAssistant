export class Expense {
    expenseId: string;
    expenseName: string;
    expenseCost: number;

    constructor(name: string = null, cost: number = 0) {
        this.expenseId = null;
        this.expenseName = name;
        this.expenseCost = cost;
    }
}