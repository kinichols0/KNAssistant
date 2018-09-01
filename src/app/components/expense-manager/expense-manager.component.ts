import { Component, Input, OnInit } from '@angular/core';
import { Expense } from '../../core/models/expense.model';
import { ExpenseService } from '../../core/services/expense.service';
import { ViewMode } from '../../core/enums/view-mode.enum';

@Component({
    selector: "expense-manager",
    templateUrl: './expense-manager.component.html'
})
export class ExpenseManagerComponent implements OnInit {
    @Input() isReadOnly = false;
    @Input() viewMode = ViewMode.Page;

    viewModeEnum = ViewMode;
    expenses: Expense[] = [];
    showAddExpenseDisplay: boolean = false;
    expenseAddName: string = "";
    expenseAddCost: number = 0;
    updateBtnText: string;
    updateBtnDisabled: boolean;
    expensesLoaded: boolean = false;

    constructor(private expenseSvc: ExpenseService) { }

    ngOnInit(): void {
        this.loadExpenses();
    }

    loadExpenses(): void {
        this.expensesLoaded = false;
        this.expenseSvc.getExpenses().subscribe(response => {
            this.expenses = response.body;
            this.expensesLoaded = true;
        });
    }

    showAddExpense(): void {
        this.updateBtnText = "Add";
        this.updateBtnDisabled = false;
        this.showAddExpenseDisplay = true;
    }

    closeAddExpense(): void {
        this.expenseAddName = '';
        this.expenseAddCost = 0;
        this.showAddExpenseDisplay = false;
    }

    addExpense(): void {
        this.showSavingState();
        if (this.expenseAddName.trim() != "" && this.expenseAddCost != null && this.expenseAddCost != undefined) {
            let expense: Expense = new Expense(this.expenseAddName, this.expenseAddCost);
            this.expenseSvc.createExpense(expense).subscribe(response => {
                this.closeAddExpense();
                this.loadExpenses();
            });
            return;
        }
        this.closeAddExpense();
    }

    showSavingState(): void {
        this.updateBtnDisabled = true;
        this.updateBtnText = "Saving...";
    }

    totalCost(): number {
        let num: number = 0;
        if (this.expenses && this.expenses.length > 0) {
            for (var i = 0; i < this.expenses.length; i++) {
                num += this.expenses[i].expenseCost;
            }
        }
        return num;
    }

    isPageView(): boolean{
        return this.viewMode == ViewMode.Page;
    }
}
