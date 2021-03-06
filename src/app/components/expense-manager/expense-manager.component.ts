import { Component, Input, OnInit } from '@angular/core';
import { Expense } from '../../core/models/expense.model';
import { ExpenseService } from '../../core/services/expense/expense.service';
import { ViewMode } from '../../core/enums/view-mode.enum';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

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
    addBtnText: string = "Add";
    addInputsDisabled: boolean;
    expensesLoaded: boolean = false;
    expenseViewItems: any[] = [];
    total: number;

    // pie chart
    pieChartLabels: string[] = [];
    pieChartData: number[] = [];
    pieChartType: string = "pie";

    constructor(private expenseService: ExpenseService) { }

    ngOnInit(): void {
        this.loadExpenses();
    }

    loadExpenses(): void {
        this.expensesLoaded = false;
        this.expenseService.getExpenses().subscribe((response) => {
            this.setExpenseViewItems(response);
            this.expensesLoaded = true;
        }, (error: HttpErrorResponse) => {
            this.showLoadingExpensesError();
        });
    }

    addExpense(): void {
        if(this.expenseAddCost == undefined || this.expenseAddName.trim() == "") return;

        this.addBtnText = "Saving...";
        this.addInputsDisabled = true;

        let expense: Expense = new Expense();
        expense.expenseName = this.expenseAddName;
        expense.expenseCost = this.expenseAddCost;
        
        this.expenseService.createExpense(expense).subscribe(response => {
            this.addBtnText = "Add";
            this.addInputsDisabled = false;
            this.clearAddExpenseFields();
            this.loadExpenses();
        });
    }

    clearAddExpenseFields(): void {
        this.expenseAddCost = undefined;
        this.expenseAddName = "";
    }

    totalCost(): number {
        let num: number = 0;
        if (this.expenseViewItems && this.expenseViewItems.length > 0) {
            for (var i = 0; i < this.expenseViewItems.length; i++) {
                num += +this.expenseViewItems[i].expense.expenseCost;
            }
        }
        return num;
    }

    isPageView(): boolean{
        return this.viewMode == ViewMode.Page;
    }

    setExpenseViewItems(expenses: Expense[]): any {
        this.expenseViewItems = [];
        this.pieChartData = [];
        this.pieChartLabels = [];
        if(expenses != null && expenses.length > 0){
            for(var i = 0; i < expenses.length; i++){
                this.expenseViewItems.push({
                    expense: expenses[i],
                    showEditView: false,
                    showActions: true,
                    editButtonText: "Update",
                    disableInputs: false,
                    edits: { name: "", cost: 0 }
                });
                this.pieChartData.push(expenses[i].expenseCost);
                this.pieChartLabels.push(expenses[i].expenseName);
            }
        }
    }

    showExpenseEditView(expenseViewItem: any, index: number): void {
        expenseViewItem.edits.name = expenseViewItem.expense.expenseName;
        expenseViewItem.edits.cost = expenseViewItem.expense.expenseCost;
        expenseViewItem.disableInputs = false;
        expenseViewItem.editButtonText = "Update";
        expenseViewItem.showActions = false;
        expenseViewItem.showEditView = true;
    }

    hideEditView(expenseViewItem: any, index: number): void {
        expenseViewItem.showActions = true;
        expenseViewItem.showEditView = false;
    }
    
    saveEditView(expenseViewItem: any, index: number): void {
        this.initUpdateState(expenseViewItem);
        expenseViewItem.expense.expenseName = expenseViewItem.edits.name;
        expenseViewItem.expense.expenseCost = expenseViewItem.edits.cost;
        this.expenseService.updateExpense(expenseViewItem.expense).subscribe(response => {
            this.hideEditView(expenseViewItem, index);
            this.loadExpenses();
        });
    }

    initUpdateState(expenseViewItem: any): void {
        expenseViewItem.disableInputs = true;
        expenseViewItem.editButtonText = "Saving...";
    }

    delete(expenseViewItem: any, index: number): void{
        this.expenseService.deleteExpense(expenseViewItem.expense).subscribe(response => {
            this.loadExpenses();
        });
    }

    chartClicked(e: any): void {
        console.log(e);
    }

    chartHovered(e: any): void {
        console.log(e);
    }

    showLoadingExpensesError(): void {

    }
}
