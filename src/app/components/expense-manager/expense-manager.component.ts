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
    showAddExpenseDisplay: boolean = false;
    expenseAddName: string;
    expenseAddCost: number;
    updateBtnText: string;
    updateBtnDisabled: boolean;
    expensesLoaded: boolean = false;
    expenseViewItems: any[] = [];

    constructor(private expenseSvc: ExpenseService) { }

    ngOnInit(): void {
        this.loadExpenses();
    }

    loadExpenses(): void {
        this.expensesLoaded = false;
        this.expenseSvc.getExpenses().subscribe(response => {
            this.setExpenseViewItems(response.body);
            this.expensesLoaded = true;
        });
    }

    showAddExpense(): void {
        this.expenseAddName = "";
        this.expenseAddCost = null;
        this.updateBtnText = "Add";
        this.updateBtnDisabled = false;
        this.showAddExpenseDisplay = true;
    }

    closeAddExpense(): void {
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
        if (this.expenseViewItems && this.expenseViewItems.length > 0) {
            for (var i = 0; i < this.expenseViewItems.length; i++) {
                num += this.expenseViewItems[i].expense.expenseCost;
            }
        }
        return num;
    }

    isPageView(): boolean{
        return this.viewMode == ViewMode.Page;
    }

    setExpenseViewItems(expenses: Expense[]): any {
        if(expenses != null && expenses.length > 0){
            this.expenseViewItems = [];
            for(var i = 0; i < expenses.length; i++){
                this.expenseViewItems.push({
                    expense: expenses[i],
                    showEditView: false,
                    showActions: true,
                    edits: { name: "", cost: 0 }
                });
            }
        }
    }

    showExpenseEditView(expenseViewItem: any, index: number): void {
        expenseViewItem.edits.name = expenseViewItem.expense.expenseName;
        expenseViewItem.edits.cost = expenseViewItem.expense.expenseCost;

        expenseViewItem.showActions = false;
        expenseViewItem.showEditView = true;
    }

    hideEditView(expenseViewItem: any, index: number): void {
        expenseViewItem.showActions = true;
        expenseViewItem.showEditView = false;
    }
    
    saveEditView(expenseViewItem: any, index: number): void {
        expenseViewItem.showActions = true;
        expenseViewItem.showEditView = false;
    }
}
